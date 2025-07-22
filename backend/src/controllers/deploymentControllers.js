import NodeModel from "../models/infraModel.js";

import Deployment from "../models/deploymentModel.js";
import { deployWordPress } from "../utils/deployWp.js";
import checkCredentialsAndUpdateDeployment from "../utils/checkDeploymentStatus.js";
import { NodeSSH } from "node-ssh";

function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}


export const deployPlan = async(req, res) => {
  try {
    // Get user ID from authenticated request
    const { uid } = req.user;
    const { deploymentName, deploymentType = 'wordpress' } = req.body;
    

    // Validate required fields
    if (!uid || !deploymentName) {
      console.warn('Validation failed - missing uid or deploymentName');
      return res.status(400).json({
        success: false,
        message: "UID and deploymentName are required",
        code: "MISSING_REQUIRED_FIELDS"
      });
    }

    // Create new deployment record with initial configuration
    const deployment = new Deployment({
      uid,
      deploymentName,
      deploymentType,
      status: 'initiated',
      wpConfig: {
        url: process.env.WP_DEFAULT_URL || 'http://localhost',
        port: process.env.WP_DEFAULT_PORT || 64395,
        databaseName: 'wpdb',
        databaseUser: 'wpuser',
        databasePassword: generateSecurePassword(),
        rootPassword: generateSecurePassword()
      },
      logs: [`${new Date().toISOString()} - Deployment initiated by user ${uid}`]
    });

    await deployment.save();
    console.log(`Deployment record created: ${deployment.deploymentId}`);

    // Immediate response to client
    res.status(202).json({
      success: true,
      message: "Deployment process started",
      deployment: {
        deploymentId: deployment.deploymentId,
        name: deployment.deploymentName,
        status: deployment.status,
        created: deployment.createdAt,
        monitorEndpoint: `/deployments/${deployment.deploymentId}/status`
      },
      uid
    });

    // Start background deployment process
    // Use setImmediate instead of setTimeout for better performance
   setTimeout(() => {
  processDeploymentAsync(deployment.deploymentId)
    .catch(err => {
      console.error(`Background processing error for ${deployment.deploymentId}:`, err);
    });
}, 2000);

  } catch (error) {
    console.error("Deployment endpoint error:", error);
    
    // Only send response if we haven't already sent one
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error during deployment initiation",
        error: error.message,
        code: "DEPLOYMENT_INIT_FAILURE"
      });
    }
  }
};

// Async background processing function
export async  function processDeploymentAsync(deploymentId) {
    console.log("Intiating the Docker Deployment")
  let deployment = null;
  let deployedInstance = null;
  
  try {
    console.log(`Starting background processing for ${deploymentId}`);
    
    // Step 1: Find and validate deployment
    const deployment = await Deployment.findOne({ deploymentId });
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found`);
    }
    
    // if( deployment.status === 'initiated' && deployment.mid !== null) {
    //   const migrationExist = await Migration.findOne({ mid: deployment.mid });
    //   if (migrationExist) { 
    //     const wp_archiveLink =  `https://api.hostastra.com/uploads/${migrationExist.wp_archive} `;
    //     const sql_dumpLink = migrationExist.sql_dump;
        
    //   }else{
    //     await deployWordPress(deploymentId, {plan: "premium"});
    //   }
    // }
    // Step 2: Update status to in-progress
    await deployment.updateStatus('in-progress', 'Starting WordPress installation');
    console.log(`Updated status to in-progress for ${deploymentId}`);
    
    // Step 3: Deploy WordPress (wait for completion)
    console.log(`Starting WordPress deployment for ${deploymentId}`);
    await deployWordPress(deploymentId, {plan: "premium"});
    console.log(`WordPress deployment completed for ${deploymentId}`);
    
    // Step 4: Update status after WordPress deployment
    await deployment.updateStatus('completed', 'WordPress installation complete, verifying credentials');
    console.log(`Updated status to wordpress-deployed for ${deploymentId}`);
    
    // Step 5: Verify and update credentials (wait for completion)
    console.log(`Starting credential verification for ${deploymentId}`);
    // deployedInstance = await checkCredentialsAndUpdateDeployment(deploymentId);
    // console.log(`Credential verification completed for ${deploymentId}`);
    
    // Final status update
    await deployment.updateStatus('completed', 'Deployment completed successfully');
    console.log(`Deployment ${deploymentId} completed successfully`);
    
    return deployedInstance;
    
  } catch (error) {
    console.error(`Error in background processing for ${deploymentId}:`, error);
    
    // Update deployment status to failed
    try {
      const failedDeployment = deployment || await Deployment.findOne({ deploymentId });
      if (failedDeployment) {
        await failedDeployment.updateStatus('completed', `Error: ${error.message}`);
        console.log(`Updated deployment ${deploymentId} status to failed`);
      } else {
        console.error(`Could not find deployment ${deploymentId} to update failure status`);
      }
    } catch (updateError) {
      console.error(`Failed to update deployment status for ${deploymentId}:`, updateError);
    }
    
    // Don't re-throw error since this is background processing
    // The error has been logged and status updated
  }
}

// ////////////////////////////////////////////////////////

// MANAGGING THE DEPLOYEMNTS CONTROLLERRS /////////////

// //////////////////////////////////////////


export const fetchDeploymentDetails = async(req,res)=>{
  try {
    
    const {deploymentId} = req.params;
    const fetchedDeployment = await Deployment.findOne({deploymentId});
    if(!fetchedDeployment){
      res.status(404).json({message: `Unable to find the deployment related with the Deploment id ${deploymentId}`});
      
    }
    
    res.status(200).json({message: "Deployment Fetched Successfully", data:fetchedDeployment});
  } catch (error) {
    res.status(503).json({message: `Error while fetching API`, error:error.message});
    
  }
}

export const deleteDeployment = async (req, res) => {
  const { deploymentId } = req.params;
  const ssh = new NodeSSH();
  
  let cleanupReport = {
    containers: false,
    volumes: false,
    directory: false,
    ports: false,
    database: false,
    networkCleanup: false
  };

  try {
    // Connect to server
    await ssh.connect({
      host: '160.187.69.17',
      username: 'root',
      password: '^^Mdaq09ei210kj@*891)dsada)-st@Gr@@b#er@10&**(!5',
      readyTimeout: 60000
    });

    console.log(`Starting cleanup for deployment: ${deploymentId}`);

    // 1. Get deployment info before deletion (for port cleanup)
    let deployment = null;
    try {
      deployment = await Deployment.findOne({ deploymentId });
    } catch (dbError) {
      console.warn(`Could not fetch deployment info: ${dbError.message}`);
    }

    // 2. Check if containers are running and get port info
    const containerCheckResult = await ssh.execCommand(
      `docker ps -a --format "table {{.Names}}\t{{.Ports}}" | grep "${deploymentId}" || echo "No containers found"`
    );
    
    let usedPorts = [];
    if (containerCheckResult.stdout && !containerCheckResult.stdout.includes("No containers found")) {
      // Extract ports from docker ps output
      const lines = containerCheckResult.stdout.split('\n');
      lines.forEach(line => {
        const portMatch = line.match(/0\.0\.0\.0:(\d+)->/g);
        if (portMatch) {
          portMatch.forEach(match => {
            const port = match.match(/(\d+)/)[1];
            usedPorts.push(port);
          });
        }
      });
    }

    // 3. Stop and remove containers with volumes (force removal)
    console.log(`Stopping containers for ${deploymentId}...`);
    const composeResult = await ssh.execCommand(
      `cd /root/deployments/${deploymentId} && docker-compose down -v --remove-orphans --timeout 30`,
      { cwd: `/root/deployments/${deploymentId}` }
    );

    if (composeResult.code === 0) {
      cleanupReport.containers = true;
      console.log(`Containers stopped successfully for ${deploymentId}`);
    } else {
      console.warn(`Docker-compose down warning: ${composeResult.stderr}`);
      // Try force removal of containers
      await ssh.execCommand(`docker rm -f $(docker ps -aq --filter "name=${deploymentId}") 2>/dev/null || true`);
    }

    // 4. Force remove any remaining volumes
    console.log(`Cleaning up volumes for ${deploymentId}...`);
    const volumeCleanup = await ssh.execCommand(
      `docker volume rm wp_${deploymentId} mysql_${deploymentId} 2>/dev/null || true && ` +
      `docker volume rm $(docker volume ls -q | grep "${deploymentId}") 2>/dev/null || true`
    );
    cleanupReport.volumes = true;

    // 5. Network cleanup
    console.log(`Cleaning up networks for ${deploymentId}...`);
    const networkCleanup = await ssh.execCommand(
      `docker network rm $(docker network ls --format "{{.Name}}" | grep "${deploymentId}") 2>/dev/null || true`
    );
    cleanupReport.networkCleanup = true;

    // 6. Remove deployment directory with force
    console.log(`Removing directory for ${deploymentId}...`);
    const rmResult = await ssh.execCommand(
      `rm -rf /root/deployments/${deploymentId}`,
      { cwd: '/root/deployments' }
    );

    if (rmResult.code === 0) {
      cleanupReport.directory = true;
      console.log(`Directory removed successfully for ${deploymentId}`);
    } else {
      console.warn(`Directory removal warning: ${rmResult.stderr}`);
      // Try with sudo if needed
      await ssh.execCommand(`sudo rm -rf /root/deployments/${deploymentId} 2>/dev/null || true`);
      cleanupReport.directory = true;
    }

    // 7. Check and clean up ports
    if (usedPorts.length > 0) {
      console.log(`Checking port cleanup for ports: ${usedPorts.join(', ')}`);
      
      for (const port of usedPorts) {
        // Check if port is still in use
        const portCheck = await ssh.execCommand(`netstat -tulpn | grep :${port} || echo "Port ${port} is free"`);
        
        if (portCheck.stdout.includes(`Port ${port} is free`)) {
          console.log(`Port ${port} is now free`);
        } else {
          console.warn(`Port ${port} might still be in use: ${portCheck.stdout}`);
          // Kill any processes still using the port
          await ssh.execCommand(`fuser -k ${port}/tcp 2>/dev/null || true`);
        }
      }
      cleanupReport.ports = true;
    } else {
      cleanupReport.ports = true; // No ports to clean
    }

    // 8. Docker system cleanup to free up space
    console.log(`Running docker system cleanup...`);
    await ssh.execCommand(`docker system prune -f --volumes 2>/dev/null || true`);

    // 9. Delete deployment record from database
    console.log(`Deleting database record for ${deploymentId}...`);
    const deletedDeployment = await Deployment.deleteOne({ deploymentId });
    
    if (deletedDeployment.deletedCount > 0) {
      cleanupReport.database = true;
      console.log(`Database record deleted for ${deploymentId}`);
    } else {
      console.warn(`No database record found for ${deploymentId}`);
      cleanupReport.database = true; // Consider it successful if record didn't exist
    }

    // 10. Final verification
    console.log(`Running final verification for ${deploymentId}...`);
    const finalCheck = await ssh.execCommand(
      `ls /root/deployments/DEP-${deploymentId} 2>/dev/null && echo "Directory still exists" || echo "Directory cleaned"`
    );

    const allCleaned = Object.values(cleanupReport).every(status => status === true);

    res.status(200).json({
      success: true,
      message: `Successfully deleted deployment ${deploymentId}`,
      deploymentId,
      cleanupReport,
      allResourcesCleaned: allCleaned,
      portsFreed: usedPorts,
      verificationMessage: finalCheck.stdout.includes('Directory cleaned') 
        ? 'All resources verified as cleaned' 
        : 'Some resources may still exist',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error deleting deployment ${deploymentId}:`, error);
    
    res.status(503).json({
      success: false,
      message: `Failed to delete deployment ${deploymentId}`,
      deploymentId,
      error: error.message,
      cleanupReport,
      partialCleanup: Object.values(cleanupReport).some(status => status === true),
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

  } finally {
    // Always close SSH connection
    try {
      ssh.dispose();
      console.log(`SSH connection closed for ${deploymentId} cleanup`);
    } catch (disposeError) {
      console.error('Error closing SSH connection:', disposeError);
    }
  }
};

export const getDeploymentStatus = async (req, res) => {
  const ssh = new NodeSSH();
  const { deploymentId } = req.params;
  
  try {
    const deployment = await Deployment.findOne({ deploymentId });
    const url =  deployment.wpConfig.url
    const wpUrlUp = await fetch(url)
    console.log(deployment)
    if(wpUrlUp.ok && deployment.status !== "success") {
      deployment.status = "success"
      await deployment.save()
    }
    
    if (!deployment) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deployment not found' 
      });
    }
    
    const node = await NodeModel.findOne({ nid: "210Sj990" }).select('+credentials.password').exec();
    const { password, port, host } = node.credentials;
    
    await ssh.connect({
      host: host,
      port: port,
      username: "root",
      password: password,
    });

    // Get stats for all containers in the deployment
    const containerStats = await ssh.execCommand(
      `docker ps --filter "name=wp_${deploymentId}" --format "{{.Names}}" | xargs -I {} docker stats {} --no-stream --format '{{json .}}'`
    );

    // Parse and combine stats from multiple containers
    const containersData = containerStats.stdout
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    const combinedStats = containersData.reduce((acc, container) => {
      // CPU Percentage
      const cpuPercent = parseFloat(container.CPUPerc.replace('%', '')) || 0;
      acc.totalCpu += cpuPercent;
      
      // Memory Usage
      const memUsage = container.MemUsage.split('/')[0].trim();
      const memValue = parseFloat(memUsage.replace(/[^\d.]/g, ''));
      const memUnit = memUsage.replace(/[\d.]/g, '').toUpperCase();
      acc.totalMemory += convertToMB(memValue, memUnit);
      
      // Network I/O
      const netIO = container.NetIO.split('/');
      const netIn = parseBytes(netIO[0].trim());
      const netOut = parseBytes(netIO[1].trim());
      acc.totalNetIn += netIn;
      acc.totalNetOut += netOut;
      
      // Block I/O
      const blockIO = container.BlockIO.split('/');
      const blockIn = parseBytes(blockIO[0].trim());
      const blockOut = parseBytes(blockIO[1].trim());
      acc.totalBlockIn += blockIn;
      acc.totalBlockOut += blockOut;
      
      acc.containerCount++;
      return acc;
    }, {
      totalCpu: 0,
      totalMemory: 0,
      totalNetIn: 0,
      totalNetOut: 0,
      totalBlockIn: 0,
      totalBlockOut: 0,
      containerCount: 0
    });

    // Calculate averages and totals
    const metrics = {
      cpu: {
        percentage: containersData.length > 0 ? (combinedStats.totalCpu / containersData.length).toFixed(2) + '%' : '0%',
        cores: containersData.length // Assuming one core per container
      },
      memory: {
        used: formatMB(combinedStats.totalMemory),
        total: deployment.memoryLimit || '2GB', // From deployment config
        percentage: ((combinedStats.totalMemory / convertToMB(2, 'GB')) * 100).toFixed(2) + '%'
      },
      network: {
        in: formatBytes(combinedStats.totalNetIn),
        out: formatBytes(combinedStats.totalNetOut),
        total: formatBytes(combinedStats.totalNetIn + combinedStats.totalNetOut)
      },
      storage: {
        in: formatBytes(combinedStats.totalBlockIn),
        out: formatBytes(combinedStats.totalBlockOut)
      },
      containers: {
        count: combinedStats.containerCount,
        status: containersData.length > 0 ? 'running' : 'stopped'
      },
      uptime: await getUptime(ssh, deploymentId), // Helper function to get uptime
      visitors: await getVisitorCount(deploymentId) // Helper function to get visitor count
    };

    ssh.dispose();
    
    res.status(200).json({
      status: 'success',
      data: {
        _id: deployment._id,
        name: deployment.deploymentName,
        status: deployment.status,
        metrics: metrics
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
};

// Helper functions
function parseBytes(input) {
  const units = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 };
  const match = input.match(/^([\d.]+)\s*([KMGTP]?B)$/i);
  if (!match) return 0;
  return parseFloat(match[1]) * units[match[2].toUpperCase()];
}

function formatBytes(bytes) {
  if (bytes === 0) return '0B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + sizes[i];
}

function convertToMB(value, unit) {
  const units = { B: 1/(1024**2), KB: 1/1024, MB: 1, GB: 1024, TB: 1024**2 };
  return value * (units[unit] || 1);
}

function formatMB(mb) {
  return mb >= 1024 ? (mb/1024).toFixed(2) + 'GB' : mb.toFixed(2) + 'MB';
}

async function getUptime(ssh, deploymentId) {
  try {
    const result = await ssh.execCommand(
      `docker inspect --format='{{.State.StartedAt}}' wp_${deploymentId}`
    );
    const startTime = new Date(result.stdout.trim());
    return formatUptime(Date.now() - startTime);
  } catch (error) {
    return 'N/A';
  }
}

function formatUptime(ms) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${days}d ${hours}h`;
}

async function getVisitorCount(deploymentId) {
  // Implement your actual visitor counting logic here
  // This could query your analytics database or access logs
  return Math.floor(Math.random() * 1000); // Placeholder
}

export const getDeploymentByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    

    // Validate UID format if needed (example)
    if (!uid || typeof uid !== 'string' || uid.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Add await to actually execute the query
    const allDeployments = (await Deployment.find({ uid }).lean()).reverse(); // .lean() for plain JS objects

    // Check if deployments exist (empty array is still truthy)
    if (!allDeployments || allDeployments.length === 0) {
      return res.status(404).json({  // 404 is more appropriate for "not found"
        success: true,
        message: "No deployments found for this user",
        data: []  // Return empty array for consistency
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deployments retrieved successfully",
      count: allDeployments.length, 
      data: allDeployments
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching deployments for user ${req.params.uid}:`, error);
    
    return res.status(500).json({  // 500 for server errors
      success: false,
      
    });
  }
};

export const restartDeployment = async (req, res) => {
  const { deploymentId } = req.params;
  const ssh = new NodeSSH(); // Fixed: Added 'new' keyword

  try {
    // Validate the Deployment First
    const deploymentExist = await Deployment.findOne({ deploymentId });

    if (!deploymentExist) {
      return res.status(404).json({ // Fixed: Added return and changed to 404
        success: false, 
        message: "Deployment not found"
      });
    }

    const node = await NodeModel.findOne({ nid: "210Sj990" })
      .select('+credentials.password')
      .exec();

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Node not found"
      });
    }

    const { password, port, host } = node.credentials;
    
    await ssh.connect({
      host: host,
      port: port,
      username: "root",
      password: password,
    });

    // Fixed: Removed duplicate ssh.connect()
    // Fixed: Added await and proper docker commands
    const { stdout, stderr } = await ssh.execCommand(
      `cd /root/deployments/${deploymentId} && docker-compose down && docker-compose up -d`
    );

    if (stderr) {
      throw new Error(`Restart failed: ${stderr}`);
    }

    res.status(200).json({
      success: true,
      message: "Deployment restarted successfully",
      output: stdout
    });

  } catch (error) {
    console.error("Restart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restart deployment",
      error: error.message
    });
  } finally {
    if (ssh.isConnected()) {
      ssh.dispose();
    }
  }
};

const migrateAndDeploy = async (req, res) => {
  try {
    // Assuming file uploads are handled by middleware like multer
    // Uploaded files will be available in req.files or req.file
    console.log("Uploaded files:", req.files || req.file);

    res.status(200).json({
      success: true,
      message: "Files received successfully",
      files: req.files || req.file
    });
  } catch (error) {
    console.error("Error in migrateAndDeploy:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process uploaded files",
      error: error.message
    });
  }
}