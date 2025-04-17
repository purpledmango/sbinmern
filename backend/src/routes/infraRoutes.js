// routes/api.js
import express from 'express';
import { Client } from 'ssh2';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import Infrastructure from '../models/infraModel.js';
import generateDockerCompose from '../lib/docker.js';
import  validateOnboardRequest  from '../lib/validators.js';

const router = express.Router();

// Deploy new WordPress instance
router.post('/onboard', async (req, res) => {
  try {
    // Validate request
    const { error } = validateOnboardRequest(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { clientName, clientId, serverCredentials, wordpressConfig } = req.body;
    
    // Generate unique instance ID
    const instanceId = uuidv4();
    
    // Generate random credentials if not provided
    const finalConfig = {
      ...wordpressConfig,
      dbName: wordpressConfig.dbName || `wp_${clientId}_${instanceId.slice(0, 8)}`,
      dbUser: wordpressConfig.dbUser || `user_${clientId}_${instanceId.slice(0, 4)}`,
      dbPassword: wordpressConfig.dbPassword || generateRandomPassword(16),
      rootPassword: wordpressConfig.rootPassword || generateRandomPassword(20),
      volumePrefix: wordpressConfig.volumePrefix || `vol_${clientId}_${instanceId.slice(0, 6)}`,
      instanceId  // Add instanceId to config
    };

    // Generate Docker Compose file
    const dockerCompose = generateDockerCompose(finalConfig);
    
    // Create infrastructure record
    const infrastructure = new Infrastructure({
      clientId,
      clientName,
      instanceId,
      serverCredentials,
      wordpressConfig: finalConfig,
      dockerComposeFile: dockerCompose,
      publicUrl: `http://${serverCredentials.host}:${finalConfig.port}`,
      createdBy: req.user?._id
    });

    // Connect via SSH and deploy
    const conn = new Client();
    conn.on('ready', () => {
      console.log('SSH connection established');
      
      // Create directory for this deployment
      const deployDir = `/opt/wp-deployments/${instanceId}`;
      
      // Commands to execute
      const commands = [
        `mkdir -p ${deployDir}`,
        `echo "${dockerCompose.replace(/"/g, '\\"')}" > ${deployDir}/docker-compose.yml`,
        `cd ${deployDir} && docker-compose up -d`
      ];

      // Execute commands sequentially
      executeSshCommands(conn, commands)
        .then(() => {
          // Save infrastructure record
          return infrastructure.save()
            .then(savedInfra => {
              conn.end();
              res.status(201).json({
                message: 'WordPress deployed successfully',
                infrastructure: savedInfra
              });
            });
        })
        .catch(err => {
          conn.end();
          console.error('Deployment failed:', err);
          res.status(500).json({ error: 'Deployment failed', details: err.message });
        });
    });

    conn.on('error', (err) => {
      console.error('SSH connection error:', err);
      res.status(500).json({ error: 'SSH connection failed', details: err.message });
    });

    const connectionOptions = {
      host: serverCredentials.host,
      port: serverCredentials.port || 22,
      username: serverCredentials.username,
      password: serverCredentials.password
    };

    if (serverCredentials.privateKey) {
      connectionOptions.privateKey = readFileSync(serverCredentials.privateKey);
    }

    conn.connect(connectionOptions);

  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get deployment status
router.get('/status/:instanceId', async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findOne({ 
      instanceId: req.params.instanceId 
    });
    
    if (!infrastructure) {
      return res.status(404).json({ error: 'Instance not found' });
    }

    // Connect via SSH to check container status
    const conn = new Client();
    conn.on('ready', () => {
      const commands = [
        `docker ps -f name=${infrastructure.instanceId} --format '{{.Names}} {{.Status}}'`
      ];

      executeSshCommands(conn, commands)
        .then(output => {
          conn.end();
          
          // Parse container status
          const status = parseContainerStatus(output, infrastructure);
          
          // Update infrastructure record
          infrastructure.updateContainerStatus(status)
            .then(updated => {
              res.json({
                status: 'success',
                infrastructure: updated
              });
            });
        })
        .catch(err => {
          conn.end();
          res.status(500).json({ error: 'Failed to check status', details: err });
        });
    });

    conn.on('error', (err) => {
      res.status(500).json({ error: 'SSH connection failed', details: err });
    });

    const connectionOptions = {
      host: infrastructure.serverCredentials.host,
      port: infrastructure.serverCredentials.port || 22,
      username: infrastructure.serverCredentials.username,
      password: infrastructure.serverCredentials.password
    };

    if (infrastructure.serverCredentials.privateKey) {
      connectionOptions.privateKey = readFileSync(infrastructure.serverCredentials.privateKey);
    }

    conn.connect(connectionOptions);

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function generateRandomPassword(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function executeSshCommands(conn, commands) {
  return new Promise((resolve, reject) => {
    let output = '';
    let currentCommand = 0;

    function executeNext() {
      if (currentCommand >= commands.length) {
        resolve(output);
        return;
      }

      conn.exec(commands[currentCommand], (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        stream.on('data', (data) => {
          output += data.toString();
        }).on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`Command failed with code ${code}`));
          } else {
            currentCommand++;
            executeNext();
          }
        }).stderr.on('data', (data) => {
          output += data.toString();
        });
      });
    }

    executeNext();
  });
}

function parseContainerStatus(output, infrastructure) {
  const lines = output.split('\n');
  const status = {
    wordpress: { isRunning: false, health: 'unknown' },
    database: { isRunning: false, health: 'unknown' }
  };

  lines.forEach(line => {
    if (line.includes(`${infrastructure.instanceId}_wordpress`)) {
      const parts = line.trim().split(/\s+/);
      status.wordpress.isRunning = true;
      status.wordpress.containerId = parts[0];
      status.wordpress.health = line.includes('Up') ? 'healthy' : 'unhealthy';
    } else if (line.includes(`${infrastructure.instanceId}_db`)) {
      const parts = line.trim().split(/\s+/);
      status.database.isRunning = true;
      status.database.containerId = parts[0];
      status.database.health = line.includes('Up') ? 'healthy' : 'unhealthy';
    }
  });

  return status;
}

export default router;