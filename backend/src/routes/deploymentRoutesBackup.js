import express from 'express';
import { NodeSSH } from 'node-ssh';
import Deployment from '../models/deploymentModel.js';
import NodeModel from '../models/infraModel.js';
import User from '../models/userModel.js';
import { deployWordPress } from '../utils/deployWp.js';
import checkCredentialsAndUpdateDeployment from '../utils/checkDeploymentStatus.js';
import { parseDockerStats } from '../utils/helperFunctions.js';
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

router.post('/', async (req, res) => {
  try {
    // Get user ID from authenticated request
    const { uid } = req.user;
    const { deploymentName, deploymentType = 'wordpress' } = req.body;
    
    console.log(`New deployment request from user ${uid} for ${deploymentName}`);

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
      }
    });

  // Deploy the Desired Docker Template

  


  try {
   setTimeout(() => {
      processDeploymentAsync(deployment.deploymentId)
        .catch(err => {
          console.error(`Background processing error for ${deployment.deploymentId}:`, err);
        });
    }, 2000);
  } catch (error) {
    console.log("Deployment Error", error)
  }

   

  } catch (error) {
    console.error("Deployment endpoint error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during deployment initiation",
      error: error.message,
      code: "DEPLOYMENT_INIT_FAILURE"
    });
  }
});

// Async background processing function
async function processDeploymentAsync(deploymentId) {
  let deployment = null;
  let deployedInstance = null;
  
  try {
    console.log(`Starting background processing for ${deploymentId}`);
    
    // Step 1: Find and validate deployment
    deployment = await Deployment.findOne({ deploymentId });
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found`);
    }
    
    // Step 2: Update status to in-progress
    await deployment.updateStatus('in-progress', 'Starting WordPress installation');
    
    // Step 3: Deploy WordPress (wait for completion)
    await deployWordPress(deploymentId);
    
    // Step 4: Update status after WordPress deployment
    await deployment.updateStatus('completed', 'Verifying installation and credentials');
    
    // Step 5: Verify and update credentials (wait for completion)
    deployedInstance = await checkCredentialsAndUpdateDeployment(deploymentId);
    
    // Final status update
    console.log(`Deployment ${deploymentId} completed successfully`);
    
    return deployedInstance;
    
  } catch (error) {
    console.error(`Error in background processing for ${deploymentId}:`, error);
    
    // Update deployment status to failed
    try {
      const failedDeployment = deployment || await Deployment.findOne({ deploymentId });
      if (failedDeployment) {
        await failedDeployment.updateStatus('failed', `Error: ${error.message}`);
        // Alternative approach using findOneAndUpdate:
        /*
        await Deployment.findOneAndUpdate(
          { deploymentId },
          {
            status: 'failed',
            $push: {
              logs: `${new Date().toISOString()} - Error: ${error.message}`
            }
          }
        );
        */
      }
    } catch (updateError) {
      console.error(`Failed to update deployment status for ${deploymentId}:`, updateError);
    }
    
    // Re-throw the original error if you want calling code to handle it
    throw error;
  }
}

// router.get('/:deploymentId/status', async (req, res) => {
//   try {
//     const { deploymentId } = req.params;
//     const { uid } = req.user;
    
//     // Find deployment record
//     const deployment = await Deployment.findOne({ 
//       deploymentId, 
//       uid // Ensure the user owns this deployment
//     });
    
//     if (!deployment) {
//       return res.status(404).json({
//         success: false,
//         message: "Deployment not found"
//       });
//     }
    
//     return res.status(200).json({
//       success: true,
//       deployment: {
//         id: deployment.deploymentId,
//         name: deployment.deploymentName,
//         status: deployment.status,
//         statusMessage: deployment.statusMessage,
//         created: deployment.deploymentDate,
//         completed: deployment.deploymentCompleted,
//         url: deployment.status === 'completed' ? 
//           `${deployment.wpConfig.url}:${deployment.wpConfig.port}` : 
//           null
//       }
//     });
//   } catch (error) {
//     console.log("Status Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve deployment status",
//       error: error.message
//     });
//   }
// });
// Helper function to generate secure passwords
function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
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
      deployments: deployments.map(deployment => ({
        // Include all other fields you want to keep
        deploymentId: deployment.deploymentId,
        deploymentType:deployment.deploymentType,
        deploymentName: deployment.deploymentName,
        status: deployment.status,
        // Only include the URL from wpConfig
        wpUrl: deployment.wpConfig?.url,
        // Add any other top-level fields you need
        createdAt: deployment.createdAt
      }))
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
    const { deploymentId } = req.params;

    // Validate deploymentId format if needed
    if (!deploymentId || typeof deploymentId !== 'string') {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_DEPLOYMENT_ID',
        message: 'Invalid deployment ID format'
      });
    }
    // await checkCredentialsAndUpdateDeployment(deploymentId);

    const deployment = await Deployment.findOne({ deploymentId })
      .populate('nodeId', 'host name region status')
      .lean(); // Convert to plain JS object

    if (!deployment) {
      return res.status(404).json({
        status: 'error',
        code: 'DEPLOYMENT_NOT_FOUND',
        message: 'Deployment not found'
      });
    }

    // Transform the response to include only necessary fields
    const response = {
      status: 'success',
      data: {
        id: deployment.deploymentId,
        name: deployment.deploymentName,
        status: deployment.status,
        type: deployment.deploymentType,
        createdAt: deployment.createdAt,
        updatedAt: deployment.updatedAt,
        wpConfig: deployment.wpConfig ? {
          url: deployment.wpConfig.url,
          port: deployment.wpConfig.port,
          adminUrl: deployment.wpConfig.adminUrl
        } : null
      }
    };

    // Set cache headers
    res.set('Cache-Control', 'no-store');
    
    res.json(response);

  } catch (error) {
    console.error(`Error fetching deployment ${req.params.deploymentId}:`, error);
    
    // Handle specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_ID_FORMAT',
        message: 'Invalid deployment ID format'
      });
    }

    res.status(500).json({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  const {deploymentId}= req.params;
  console.log("deployment id ", deploymentId);
  
  try {
    const deployment = await Deployment.findOne({deploymentId:req.params.deploymentId});
    
    if (!deployment) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deployment not found' 
      });
    }
    
    const node = await NodeModel.findOne({nid: "210Sj990"}).select('+credentials.password').exec();

    const {password, port, host} = node.credentials;

    console.log("Credentials", password)
    console.log("Port", port)
    console.log("Host", host)

    // console.log("Fetched Node", node);
    
    if (!node) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Associated node not found' 
      });
    }
    
    // Connect to the node
    // console.log("Node details", node.credentials)
    await ssh.connect({
      host: host,
      port: port,
      username: "root",
      password: password,
    });
    
  
    
    const containerStats = await ssh.execCommand(`docker stats wp_${deploymentId} --no-stream --format \
'{{json .}}'`)
    console.log("Container Stats", containerStats.stdout)
    // console.log(typeof(containerStats.stdout));
  
   
    ssh.dispose();
    
    res.json({
      status: 'success',
      deployment: {
        _id: deployment._id,
        name: deployment.deploymentName,
        status: deployment.status,
        matrics: containerStats.stdout,
       
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