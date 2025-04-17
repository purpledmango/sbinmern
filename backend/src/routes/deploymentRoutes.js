import express from 'express';
import { NodeSSH } from 'node-ssh';
import Deployment from '../models/deploymentModel.js';
import NodeModel from '../models/infraModel.js';
import User from '../models/userModel.js';
const router = express.Router();

// Helper function to generate random available port
async function findAvailablePort(ssh, startRange = 10000, endRange = 65000) {
  try {
    // Get list of used ports
    const result = await ssh.execCommand('netstat -tuln | grep LISTEN | awk \'{print $4}\' | awk -F: \'{print $NF}\'');
    const usedPorts = result.stdout.split('\n').map(port => parseInt(port.trim())).filter(port => !isNaN(port));
    
    // Find an available port
    let port;
    do {
      port = Math.floor(Math.random() * (endRange - startRange)) + startRange;
    } while (usedPorts.includes(port));
    
    return port;
  } catch (error) {
    console.error('Error finding available port:', error);
    // Fallback to a random port without checking
    return Math.floor(Math.random() * (endRange - startRange)) + startRange;
  }
}

// Helper function to check system resources
async function checkSystemResources(ssh) {
  try {
    // Check available disk space (need at least 1GB free)
    const diskSpace = await ssh.execCommand("df -h / | awk 'NR==2 {print $4}'");
    const availableDisk = diskSpace.stdout.trim();
    const diskGB = parseFloat(availableDisk);
    const sufficientDisk = availableDisk.includes('G') && diskGB >= 1;

    // Check available RAM (need at least 1GB free)
    const ramCheck = await ssh.execCommand("free -m | awk 'NR==2 {print $7}'");
    const availableRAM = parseInt(ramCheck.stdout.trim());
    const sufficientRAM = availableRAM >= 1024; // 1GB in MB

    // Check if Docker is installed
    const dockerCheck = await ssh.execCommand("which docker");
    const dockerInstalled = dockerCheck.stdout.trim() !== '';

    return {
      sufficientDisk,
      sufficientRAM,
      dockerInstalled,
      availableDisk,
      availableRAM: `${availableRAM} MB`
    };
  } catch (error) {
    console.error('Error checking system resources:', error);
    throw new Error('Failed to check system resources');
  }
}

// Create new deployment
router.post('/', async (req, res) => {
  const ssh = new NodeSSH();
  
  try {
    const { uid, nodeId, deploymentName, wpConfig } = req.body;
    console.log("Request body", req.body)
    
    // Validate required fields
    if (!uid || !nodeId || !deploymentName) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields' 
      });
    }
    
    // Check if client exists
    const client = await User.findOne({uid});
    if (!client) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Client not found' 
      });
    }
    
    // Check if node exists
    const node = await NodeModel.findById(nodeId);
    if (!node) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Node not found' 
      });
    }
    
    // Check if a deployment with the same name already exists for this client
    const existingDeployment = await Deployment.findOne({ 
      uid, 
      deploymentName 
    });
    
    if (existingDeployment) {
      return res.status(409).json({ 
        status: 'error', 
        message: 'A deployment with this name already exists for this client' 
      });
    }
    
    // Connect to the node
    await ssh.connect({
      host: node.host,
      port: parseInt(node.port, 10),
      username: node.username,
      password: node.encryptedPassword,
      tryKeyboard: true,
      readyTimeout: 10000
    });
    
    // Check system resources
    const resources = await checkSystemResources(ssh);
    
    if (!resources.dockerInstalled) {
      ssh.dispose();
      return res.status(400).json({ 
        status: 'error', 
        message: 'Docker is not installed on the target node', 
        resources 
      });
    }
    
    if (!resources.sufficientDisk || !resources.sufficientRAM) {
      ssh.dispose();
      return res.status(400).json({ 
        status: 'error', 
        message: 'Insufficient system resources on the target node', 
        resources 
      });
    }
    
    // Generate random ports
    const httpPort = await findAvailablePort(ssh, 10000, 20000);
    const httpsPort = await findAvailablePort(ssh, 20001, 30000);
    const mysqlPort = await findAvailablePort(ssh, 30001, 40000);
    
    // Create safe container name (alphanumeric and dashes only)
    const containerName = `wp-${uid.substring(0, 5)}-${deploymentName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    
    // Set the siteUrl in wpConfig based on the node's host and port
    const updatedWpConfig = {
      ...wpConfig,
      siteUrl: `http://${node.host}:${httpPort}`
    };
    
    // Create a new deployment record
    const newDeployment = new Deployment({
      uid,
      nodeId,
      deploymentId: 1,
      deploymentName,
      status: 'initiated',
      containerName,
      image: 'wordpress:latest',
      wpConfig: updatedWpConfig || {},
      ports: {
        http: httpPort,
        https: httpsPort,
        mysqlPort
      },
  
    });
    
    // Save initial deployment record
    await newDeployment.save();
    
    // Update status to in-progress
    await newDeployment.updateStatus('in-progress', 'Deployment started');
    
    // Add log entry
    await newDeployment.addLog('info', `Deployment initiated on node ${node.host}`);
    
    // Create docker-compose file content
    const composeContent = `
version: '3'

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${updatedWpConfig?.databasePassword || 'wordpress_db_password'}
      MYSQL_DATABASE: ${updatedWpConfig?.databaseName || 'wordpress'}
      MYSQL_USER: ${updatedWpConfig?.databaseUser || 'wordpress_user'}
      MYSQL_PASSWORD: ${updatedWpConfig?.databasePassword || 'wordpress_db_password'}
    container_name: ${containerName}-db

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "${httpPort}:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${updatedWpConfig?.databaseUser || 'wordpress_user'}
      WORDPRESS_DB_PASSWORD: ${updatedWpConfig?.databasePassword || 'wordpress_db_password'}
      WORDPRESS_DB_NAME: ${updatedWpConfig?.databaseName || 'wordpress'}
      WORDPRESS_TABLE_PREFIX: ${updatedWpConfig?.tablePrefix || 'wp_'}
      WORDPRESS_CONFIG_EXTRA: define('WP_SITEURL', '${updatedWpConfig?.siteUrl || `http://${node.host}:${httpPort}`}'); define('WP_HOME', '${updatedWpConfig?.siteUrl || `http://${node.host}:${httpPort}`}');
    volumes:
      - wordpress_data:/var/www/html
    container_name: ${containerName}

volumes:
  db_data:
  wordpress_data:
    `;
    
    // Create deployment directory
    await ssh.execCommand(`mkdir -p /opt/deployments/${containerName}`);
    
    // Write docker-compose file
    await ssh.execCommand(`cat > /opt/deployments/${containerName}/docker-compose.yml << 'EOL'
${composeContent}
EOL`);
    
    // Deploy containers
    const deployResult = await ssh.execCommand(`cd /opt/deployments/${containerName} && docker-compose up -d`);
    
    ssh.dispose();
    
    // Fix: Don't treat normal docker-compose output containing "Creating" as an error
    if (deployResult.stderr && 
        !deployResult.stderr.includes('Creating network') && 
        !deployResult.stderr.includes('Creating volume') && 
        !deployResult.stderr.includes('Creating container')) {
      // Real deployment failure
      await newDeployment.updateStatus('failed', deployResult.stderr);
      await newDeployment.addLog('error', deployResult.stderr);
      
      return res.status(500).json({ 
        status: 'error', 
        message: 'Deployment failed', 
        error: deployResult.stderr,
        deployment: newDeployment
      });
    }
    
    console.log("node ", node);
    // Get container IDs
    await ssh.connect({
      host: node.host,
      port: parseInt(node.port, 10),
      username: node.username,
      password: node.encryptedPassword  // Fixed: Using encryptedPassword consistently
    });
    
    const containerInfo = await ssh.execCommand(`docker ps --filter "name=${containerName}" --format "{{.ID}}"`);
    
    // if (containerInfo.stdout) {
    //   newDeployment.containerId = containerInfo.stdout.trim();
    // }
    
    // Update deployment record with success
    await newDeployment.updateStatus('completed', 'Deployment completed successfully');
    await newDeployment.addLog('info', `WordPress deployed successfully on ports HTTP: ${httpPort}, HTTPS: ${httpsPort}, MySQL: ${mysqlPort}`);
    
    ssh.dispose();
    
    // Return the deployment info
    res.status(201).json({
      status: 'success',
      message: 'Deployment created successfully',
      deployment: newDeployment,
      access: {
        url: updatedWpConfig.siteUrl,
        ports: {
          http: httpPort,
          https: httpsPort,
          mysql: mysqlPort
        }
      }
    });
    
  } catch (error) {
    console.error('Deployment error:', error);
    
    if (ssh.isConnected()) {
      ssh.dispose();
    }
    
    // If we have a deployment in progress, mark it as failed
    if (req.body.deploymentId) {
      try {
        const deployment = await Deployment.findById(req.body.deploymentId);
        if (deployment) {
          await deployment.updateStatus('failed', error.message);
          await deployment.addLog('error', error.message);
        }
      } catch (logError) {
        console.error('Failed to update deployment status:', logError);
      }
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Deployment failed', 
      error: error.message 
    });
  }
});

// Get all deployments
router.get('/', async (req, res) => {
  try {
    
    const {uid} = req.user
    
    // Build query based on provided filters
    const query = {};
    if (uid) query.uid = uid; // Fixed: Changed from clientId to uid
    
    // if (status) query.status = status;
    
    const deployments = await Deployment.find({uid}).sort({ createdAt: -1 }).exec();
    
      
    res.json({
      status: 'success',
      count: deployments.length,
      deployments
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
    console.log("error during deployment", error);
  }
});

// Get deployment by ID
router.get('/:deploymentId', async (req, res) => {
  try {
    const deployment = await Deployment.findOne({deploymentId})
      .populate('nodeId', 'host name');
      
    if (!deployment) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deployment not found' 
      });
    }
    
    res.json({
      status: 'success',
      deployment
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Delete deployment (including containers)
router.delete('/:id', async (req, res) => {
  const ssh = new NodeSSH();
  
  try {
    const deployment = await Deployment.findById(req.params.id);
    
    if (!deployment) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deployment not found' 
      });
    }
    
    const node = await NodeModel.findById(deployment.nodeId);
    
    if (!node) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Associated node not found' 
      });
    }
    
    // Connect to the node
    await ssh.connect({
      host: node.host,
      port: parseInt(node.port, 10),
      username: node.username,
      password: node.encryptedPassword  // Fixed: Using encryptedPassword consistently
    });
    
    // Stop and remove containers using docker-compose
    await ssh.execCommand(`cd /opt/deployments/${deployment.containerName} && docker-compose down -v`);
    
    // Remove deployment directory
    await ssh.execCommand(`rm -rf /opt/deployments/${deployment.containerName}`);
    
    ssh.dispose();
    
    // Delete deployment record
    await Deployment.findByIdAndDelete(req.params.id);
    
    res.json({
      status: 'success',
      message: 'Deployment deleted successfully'
    });
  } catch (error) {
    if (ssh.isConnected()) {
      ssh.dispose();
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to delete deployment', 
      error: error.message 
    });
  }
});

// Route to check deployment status
router.get('/:deploymentId/status', async (req, res) => {
  const ssh = new NodeSSH();
  
  try {
    const deployment = await Deployment.findOne({deploymentId:req.params.deploymentId});
    
    if (!deployment) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deployment not found' 
      });
    }
    
    const node = await NodeModel.findById(deployment.nodeId);
    
    if (!node) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Associated node not found' 
      });
    }
    
    // Connect to the node
    await ssh.connect({
      host: node.host,
      port: parseInt(node.port, 10),
      username: node.username,
      password: node.encryptedPassword  // Fixed: Using encryptedPassword consistently
    });
    
    // Check container status
    const containerStatus = await ssh.execCommand(`docker ps -a --filter "name=${deployment.containerName}" --format "{{.Status}}"`);
    
    // Get logs if available
    const containerLogs = await ssh.execCommand(`docker logs --tail 50 ${deployment.containerName} 2>&1 || echo "No logs available"`);
    
    ssh.dispose();
    
    res.json({
      status: 'success',
      deployment: {
        _id: deployment._id,
        name: deployment.deploymentName,
        status: deployment.status,
        containerStatus: containerStatus.stdout.trim() || 'Not running',
        logs: containerLogs.stdout || 'No logs available'
      }
    });
  } catch (error) {
    if (ssh.isConnected()) {
      ssh.dispose();
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to check deployment status', 
      error: error.message 
    });
  }
});

export default router;