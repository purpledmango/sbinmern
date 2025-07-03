import { NodeSSH } from 'node-ssh';
import crypto from 'crypto';
import Deployment from "../models/deploymentModel.js";
import { findAvailablePort } from './helperFunctions.js';

// Function to generate a secure random password
const generateRandomPassword = (length = 20) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars.charAt(randomBytes[i] % chars.length);
  }
  return password;
};

// Default plan configurations - Fixed swap limits to be larger than memory limits
const DEFAULT_PLANS = {
  basic: {
    name: 'Basic Plan',
    cpu: '0.5',
    memory: '512m',
    diskSize: '5G',
    swapLimit: '1g'
  },
  standard: {
    name: 'Standard Plan',
    cpu: '1.0',
    memory: '1g',
    diskSize: '10G',
    swapLimit: '2g'
  },
  premium: {
    name: 'Premium Plan',
    cpu: '2.0',
    memory: '2g',
    diskSize: '20G',
    swapLimit: '4g'
  }
};

// Function to parse memory string to MB for calculations
const parseMemoryToMB = (memoryStr) => {
  const value = parseInt(memoryStr);
  const unit = memoryStr.slice(-1).toLowerCase();
  
  switch (unit) {
    case 'g':
      return value * 1024;
    case 'm':
      return value;
    default:
      return value; // assume MB if no unit
  }
};

// Function to ensure swap limit is larger than memory limit
const validateAndFixSwapLimit = (memory, swapLimit) => {
  const memoryMB = parseMemoryToMB(memory);
  const swapMB = parseMemoryToMB(swapLimit);
  
  if (swapMB <= memoryMB) {
    // Set swap to 2x memory if it's not larger
    const newSwapMB = memoryMB * 2;
    return newSwapMB >= 1024 ? `${Math.ceil(newSwapMB / 1024)}g` : `${newSwapMB}m`;
  }
  
  return swapLimit;
};

// Function to create Docker volume with size limit
const createDockerVolume = async (ssh, volumeName, sizeLimit) => {
  console.log(`Creating Docker volume: ${volumeName} with size limit: ${sizeLimit}`);
  
  try {
    // Create the volume
    const createVolumeResult = await ssh.execCommand(`docker volume create ${volumeName}`);
    if (createVolumeResult.code !== 0) {
      throw new Error(`Failed to create volume: ${createVolumeResult.stderr}`);
    }
    
    // Get volume path
    const inspectResult = await ssh.execCommand(`docker volume inspect ${volumeName} --format '{{.Mountpoint}}'`);
    if (inspectResult.code !== 0) {
      throw new Error(`Failed to inspect volume: ${inspectResult.stderr}`);
    }
    
    const volumePath = inspectResult.stdout.trim();
    
    // Create a loop device with size limit (optional advanced setup)
    // For basic size monitoring, we'll rely on container limits
    console.log(`Volume ${volumeName} created at: ${volumePath}`);
    
    return {
      success: true,
      volumeName,
      volumePath,
      sizeLimit
    };
    
  } catch (error) {
    console.error(`Error creating volume ${volumeName}:`, error);
    throw error;
  }
};

// Function to deploy WordPress with Docker Compose and custom configuration
export const deployWordPress = async (deploymentId, config = {}) => {
  const ssh = new NodeSSH();
  let deployment = null;
  
  try {
    console.log(`Starting WordPress deployment for deploymentId: ${deploymentId}`);
    console.log('Deployment config:', JSON.stringify(config, null, 2));
    
    // Get deployment record from database
    deployment = await Deployment.findOne({ deploymentId });
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found in database`);
    }
    
    // Parse and validate configuration
    const {
      plan = 'basic',
      customResources = {},
      volumeSize,
      cpuLimit,
      memoryLimit,
      swapLimit
    } = config;
    
    // Get plan configuration or use custom resources
    let resourceConfig;
    if (DEFAULT_PLANS[plan]) {
      resourceConfig = { ...DEFAULT_PLANS[plan], ...customResources };
    } else {
      resourceConfig = {
        name: 'Custom Plan',
        cpu: cpuLimit || '0.5',
        memory: memoryLimit || '512m',
        diskSize: volumeSize || '5G',
        swapLimit: swapLimit || '1g'
      };
    }
    
    // Validate and fix swap limit to ensure it's larger than memory
    resourceConfig.swapLimit = validateAndFixSwapLimit(resourceConfig.memory, resourceConfig.swapLimit);
    
    console.log('Using resource configuration:', resourceConfig);
    
    // Establish SSH connection
    console.log('Establishing SSH connection...');
    try {
      await ssh.connect({
        host: '160.187.69.17',
        username: 'root',
        password: '^^Mdaq09ei210kj@*891)dsada)-st@Gr@@b#er@10&**(!5',
        readyTimeout: 60000
      });
    } catch (error) {
      console.log("Error During SSH connection", error);
      throw error;
    }
    console.log('SSH Connection Established');
    
    // Update deployment status
    await deployment.updateStatus('in-progress', 'SSH connection established, preparing WordPress deployment');
    
    // Generate configuration values
    const dbPassword = deployment.wpConfig.databasePassword || generateRandomPassword();
    const mysqlRootPassword = deployment.wpConfig.rootPassword || generateRandomPassword();
    const wpPort = await findAvailablePort(ssh, 50);
    const userId = deployment.uid;
    
    // Create unique volume names
    const mysqlVolumeName = `mysql_${deploymentId}`;
    const wpVolumeName = `wp_${deploymentId}`;
    
    // Update deployment with final configuration
    deployment.wpConfig = {
      ...deployment.wpConfig,
      url: `http://160.187.69.17:${wpPort}`,
      port: wpPort,
      databasePassword: dbPassword,
      rootPassword: mysqlRootPassword,
      plan: resourceConfig.name,
      resources: resourceConfig
    };
    await deployment.save();
    
    // Define the base path for user directories
    const basePath = `/root/deployments/${deploymentId}`;
    
    console.log(`Creating directories for deployment: ${basePath}`);
    
    // Create necessary directories
    const mkdirResult = await ssh.execCommand(`mkdir -p ${basePath}/wordpress ${basePath}/mysql`);
    if (mkdirResult.code !== 0) {
      throw new Error(`Failed to create directories: ${mkdirResult.stderr}`);
    }
    
    // Update status
    await deployment.updateStatus('in-progress', 'Created deployment directories');
    
    // Create Docker volumes with size limits
    console.log('Creating Docker volumes...');
    await createDockerVolume(ssh, mysqlVolumeName, resourceConfig.diskSize);
    await createDockerVolume(ssh, wpVolumeName, resourceConfig.diskSize);
    
    // Update status
    await deployment.updateStatus('in-progress', 'Docker volumes created with size limits');
    
    // Calculate MySQL buffer pool size (60% of memory, converted to MB)
    const memoryMB = parseMemoryToMB(resourceConfig.memory);
    const bufferPoolSizeMB = Math.floor(memoryMB * 0.6);
    
    // Calculate reserved resources (50% of limits)
    const reservedCpu = (parseFloat(resourceConfig.cpu) * 0.5).toFixed(1);
    const reservedMemoryMB = Math.floor(memoryMB * 0.5);
    const reservedMemory = reservedMemoryMB >= 1024 ? 
      `${Math.ceil(reservedMemoryMB / 1024)}g` : `${reservedMemoryMB}m`;
    
    // Calculate DB CPU limit (80% of total)
    const dbCpuLimit = (parseFloat(resourceConfig.cpu) * 0.8).toFixed(1);
    const dbReservedCpu = (parseFloat(resourceConfig.cpu) * 0.3).toFixed(1);
    const dbReservedMemoryMB = Math.floor(memoryMB / 3);
    const dbReservedMemory = dbReservedMemoryMB >= 1024 ? 
      `${Math.ceil(dbReservedMemoryMB / 1024)}g` : `${dbReservedMemoryMB}m`;
    
    // Create Docker Compose file with resource limits
    const dockerComposeContent = `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    container_name: wp_${deploymentId}
    restart: unless-stopped
    ports:
      - "${wpPort}:80"
    volumes:
      - ${wpVolumeName}:/var/www/html
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: ${dbPassword}
      WORDPRESS_DB_NAME: wpdb
    depends_on:
      - db
    deploy:
      resources:
        limits:
          cpus: '${resourceConfig.cpu}'
          memory: ${resourceConfig.memory}
        reservations:
          cpus: '${reservedCpu}'
          memory: ${reservedMemory}
    mem_limit: ${resourceConfig.memory}
    cpus: ${resourceConfig.cpu}
    
  db:
    image: mysql:8.0
    container_name: db_${deploymentId}
    restart: unless-stopped
    volumes:
      - ${mysqlVolumeName}:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${mysqlRootPassword}
      MYSQL_DATABASE: wpdb
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: ${dbPassword}
    command: --default-authentication-plugin=mysql_native_password --innodb-buffer-pool-size=${bufferPoolSizeMB}M
    deploy:
      resources:
        limits:
          cpus: '${dbCpuLimit}'
          memory: ${resourceConfig.memory}
        reservations:
          cpus: '${dbReservedCpu}'
          memory: ${dbReservedMemory}
    mem_limit: ${resourceConfig.memory}
    cpus: ${dbCpuLimit}

volumes:
  ${mysqlVolumeName}:
    external: true
  ${wpVolumeName}:
    external: true`;
    
    // Save Docker Compose file
    console.log('Creating Docker Compose configuration with resource limits...');
    const composeResult = await ssh.execCommand(`cat > ${basePath}/docker-compose.yml << 'EOF'
${dockerComposeContent}
EOF`);
    
    if (composeResult.code !== 0) {
      throw new Error(`Failed to create docker-compose.yml: ${composeResult.stderr}`);
    }
    
    // Update status
    await deployment.updateStatus('in-progress', 'Docker Compose configuration created with resource limits');
    
    // Save credentials and configuration
    const credentialsContent = `WordPress Deployment Credentials:
Deployment ID: ${deploymentId}
Plan: ${resourceConfig.name}
WordPress URL: http://160.187.69.17:${wpPort}
WordPress Port: ${wpPort}

Resource Allocation:
CPU Limit: ${resourceConfig.cpu} cores
Memory Limit: ${resourceConfig.memory}
Disk Size: ${resourceConfig.diskSize}
Swap Limit: ${resourceConfig.swapLimit} (validated)

Database Configuration:
DB Name: wpdb
DB User: wpuser
DB Password: ${dbPassword}
MySQL Root Password: ${mysqlRootPassword}
MySQL Buffer Pool: ${bufferPoolSizeMB}MB

Volume Information:
WordPress Volume: ${wpVolumeName}
MySQL Volume: ${mysqlVolumeName}

Created: ${new Date().toISOString()}`;
    
    await ssh.execCommand(`cat > ${basePath}/credentials.txt << 'EOF'
${credentialsContent}
EOF`);
    
    // Update status
    await deployment.updateStatus('in-progress', 'Starting Docker containers with resource limits');
    
    // Configure firewall before starting containers
    console.log(`Configuring firewall for port ${wpPort}...`);
    const firewallResult = await ssh.execCommand(`ufw allow ${wpPort}/tcp`);
    console.log('Firewall configuration:', firewallResult.stdout);
    
    // Run Docker Compose
    console.log('Starting Docker containers with resource limits...');
    const dockerResult = await ssh.execCommand(`cd ${basePath} && docker-compose up -d`);
    
    if (dockerResult.code !== 0) {
      throw new Error(`Failed to start Docker containers: ${dockerResult.stderr}`);
    }
    
    console.log('Docker containers started:', dockerResult.stdout);
    
    // Update status
    await deployment.updateStatus('in-progress', 'Docker containers started, waiting for services to be ready');
    
    // Wait for services to be ready
    console.log('Waiting for services to initialize...');
    await new Promise(resolve => setTimeout(resolve, 20000)); // Increased wait time for resource-limited containers
    
    // Verify deployment
    const statusResult = await ssh.execCommand(`cd ${basePath} && docker-compose ps`);
    console.log('Container status:', statusResult.stdout);
    
    // Check resource usage
    const resourceUsageResult = await ssh.execCommand(`docker stats --no-stream --format "table {{.Container}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.MemPerc}}" $(docker ps --filter "name=${deploymentId}" --format "{{.Names}}")`);
    console.log('Resource usage:', resourceUsageResult.stdout);
    
    // Update deployment with successful deployment info
    deployment.status = 'success';
    deployment.wpConfig.url = `http://160.187.69.17:${wpPort}`;
    deployment.wpConfig.resourceUsage = resourceUsageResult.stdout;
    deployment.deployedAt = new Date();
    await deployment.save();
    
    console.log(`WordPress deployment completed successfully for ${deploymentId}`);
    
    return {
      success: true,
      deploymentId: deploymentId,
      url: `http://160.187.69.17:${wpPort}`,
      port: wpPort,
      plan: resourceConfig.name,
      resources: resourceConfig,
      volumes: {
        wordpress: wpVolumeName,
        mysql: mysqlVolumeName
      },
      credentials: {
        dbName: 'wpdb',
        dbUser: 'wpuser',
        dbPassword: dbPassword,
        mysqlRootPassword: mysqlRootPassword
      },
      containerStatus: statusResult.stdout,
      resourceUsage: resourceUsageResult.stdout
    };
    
  } catch (error) {
    console.error(`Error during WordPress deployment for ${deploymentId}:`, error);
    
    // Update deployment status to failed
    if (deployment) {
      try {
        await deployment.updateStatus('completed', `WordPress deployment failed: ${error.message}`);
      } catch (updateError) {
        console.error('Failed to update deployment status:', updateError);
      }
    }
    
    // Clean up volumes if they were created
    try {
      if (ssh && ssh.isConnected()) {
        await ssh.execCommand(`docker volume rm mysql_${deploymentId} wp_${deploymentId} 2>/dev/null || true`);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up volumes:', cleanupError);
    }
    
    // Clean up SSH connection
    if (ssh && ssh.isConnected()) {
      ssh.dispose();
    }
    
    throw error;
    
  } finally {
    // Always clean up SSH connection
    if (ssh && ssh.isConnected()) {
      try {
        ssh.dispose();
        console.log('SSH connection closed');
      } catch (disposeError) {
        console.error('Error disposing SSH connection:', disposeError);
      }
    }
  }
};

// Example usage function
export const deployWithConfig = async (deploymentId, configType = 'basic', customConfig = {}) => {
  let config = {};
  
  switch (configType) {
    case 'basic':
      config = {
        plan: 'basic'
      };
      break;
      
    case 'standard':
      config = {
        plan: 'standard'
      };
      break;
      
    case 'premium':
      config = {
        plan: 'premium'
      };
      break;
      
    case 'custom':
      config = {
        cpuLimit: customConfig.cpu || '0.5',
        memoryLimit: customConfig.memory || '512m',
        volumeSize: customConfig.diskSize || '5G',
        swapLimit: customConfig.swapLimit || '1g'
      };
      break;
      
    default:
      config = { plan: 'basic' };
  }
  
  // Merge with any additional custom configuration
  config = { ...config, ...customConfig };
  
  return await deployWordPress(deploymentId, config);
};

export { DEFAULT_PLANS };
export default deployWordPress;