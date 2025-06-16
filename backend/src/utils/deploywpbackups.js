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

// Function to generate a random port between 10000 and 65000
// const generateRandomPort = () => {
//   return Math.floor(Math.random() * (65000 - 10000)) + 10000;
// };

// Function to deploy WordPress with Docker Compose
export const deployWordPress = async (deploymentId) => {
  const ssh = new NodeSSH(); // Create new instance for each deployment
  let deployment = null;
  
  try {
    console.log(`Starting WordPress deployment for deploymentId: ${deploymentId}`);
    
    // Get deployment record from database
    deployment = await Deployment.findOne({ deploymentId });
    if (!deployment) {
      throw new Error(`Deployment ${deploymentId} not found in database`);
    }
    
    // Establish the SSH connection
    console.log('Establishing SSH connection...');
    try {
      await ssh.connect({
      host: '160.187.69.17',
      username: 'root',
      password: '^^M@*891))-st@Gr@@b#er@10&**(!5',
      readyTimeout: 60000
    });
    } catch (error) {
      console.log("Error During SSH connection", error)
    }
    console.log('SSH Connection Established');
    
    // Update deployment status
    await deployment.updateStatus('in-progress', 'SSH connection established, preparing WordPress deployment');
    
    // Use existing wpConfig or generate new values
    const dbPassword = deployment.wpConfig.databasePassword || generateRandomPassword();
    const mysqlRootPassword = deployment.wpConfig.rootPassword || generateRandomPassword();
    const wpPort = await findAvailablePort(ssh, 50);
    const userId = deployment.uid;
    
    // Update deployment with final configuration
    deployment.wpConfig = {
      ...deployment.wpConfig,
      url: `http://160.187.69.17:${wpPort}`,
      port: wpPort,
      databasePassword: dbPassword,
      rootPassword: mysqlRootPassword
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
    
    // Create Docker Compose file
    const dockerComposeContent = `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    container_name: wp_${deploymentId}
    restart: unless-stopped
    ports:
      - "${wpPort}:80"
    volumes:
      - ${basePath}/wordpress:/var/www/html
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: ${dbPassword}
      WORDPRESS_DB_NAME: wpdb
    depends_on:
      - db
  db:
    image: mysql:8.0
    container_name: db_${deploymentId}
    restart: unless-stopped
    volumes:
      - mysql_${deploymentId}:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${mysqlRootPassword}
      MYSQL_DATABASE: wpdb
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: ${dbPassword}
    command: --default-authentication-plugin=mysql_native_password
volumes:
  mysql_${deploymentId}:`;
    
    // Save Docker Compose file
    console.log('Creating Docker Compose configuration...');
    const composeResult = await ssh.execCommand(`cat > ${basePath}/docker-compose.yml << 'EOF'
${dockerComposeContent}
EOF`);
    
    if (composeResult.code !== 0) {
      throw new Error(`Failed to create docker-compose.yml: ${composeResult.stderr}`);
    }
    
    // Update status
    await deployment.updateStatus('success', 'Docker Compose configuration created');
    
    // Save credentials
    const credentialsContent = `WordPress Deployment Credentials:
Deployment ID: ${deploymentId}
WordPress URL: http://160.187.69.17:${wpPort}
WordPress Port: ${wpPort}
DB Name: wpdb
DB User: wpuser
DB Password: ${dbPassword}
MySQL Root Password: ${mysqlRootPassword}
Created: ${new Date().toISOString()}`;
    
    await ssh.execCommand(`cat > ${basePath}/credentials.txt << 'EOF'
${credentialsContent}
EOF`);
    
    // Update status
    await deployment.updateStatus('initiated', 'Starting Docker containers');
    
    // Configure firewall before starting containers
    console.log(`Configuring firewall for port ${wpPort}...`);
    const firewallResult = await ssh.execCommand(`ufw allow ${wpPort}/tcp`);
    console.log('Firewall configuration:', firewallResult.stdout);
    
    // Run Docker Compose
    console.log('Starting Docker containers...');
    const dockerResult = await ssh.execCommand(`cd ${basePath} && docker-compose up -d`);
    
    if (dockerResult.code !== 0) {
      throw new Error(`Failed to start Docker containers: ${dockerResult.stderr}`);
    }
    
    console.log('Docker containers started:', dockerResult.stdout);
    
    // Update status
    await deployment.updateStatus('in-progress', 'Docker containers started, waiting for services to be ready');
    
    // Wait for services to be ready
    console.log('Waiting for services to initialize...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Verify deployment
    const statusResult = await ssh.execCommand(`cd ${basePath} && docker-compose ps`);
    console.log('Container status:', statusResult.stdout);
    
    // Check if containers are running
    const healthCheckResult = await ssh.execCommand(`cd ${basePath} && docker-compose ps --format "table {{.Name}}\\t{{.Status}}"`);
    console.log('Health check:', healthCheckResult.stdout);
    
    // Test WordPress accessibility
    // const curlResult = await ssh.execCommand(`curl -I http://localhost:${wpPort} --connect-timeout 10`);
    // console.log('WordPress accessibility test:', curlResult.stdout);
    
    // Update deployment with successful deployment info
    deployment.status = 'success';
    deployment.wpConfig.url = `http://160.187.69.17:${wpPort}`;
    deployment.deployedAt = new Date();

    // deployment.logs.push(`${new Date().toISOString()} - WordPress deployed successfully at port ${wpPort}`);
    await deployment.save();
    
    console.log(`WordPress deployment completed successfully for ${deploymentId}`);
    
    return {
      success: true,
      deploymentId: deploymentId,
      url: `http://160.187.69.17:${wpPort}`,
      port: wpPort,
      credentials: {
        dbName: 'wpdb',
        dbUser: 'wpuser',
        dbPassword: dbPassword,
        mysqlRootPassword: mysqlRootPassword
      },
      containerStatus: statusResult.stdout
    };
    
  } catch (error) {
    console.error(`Error during WordPress deployment for ${deploymentId}:`, error);
    
    // Update deployment status to failed
    if (deployment) {
      try {
        await deployment.updateStatus('failed', `WordPress deployment failed: ${error.message}`);
      } catch (updateError) {
        console.error('Failed to update deployment status:', updateError);
      }
    }
    
    // Clean up SSH connection
    if (ssh && ssh.isConnected()) {
      ssh.dispose();
    }
    
    // Re-throw error to be handled by processDeploymentAsync
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

export default deployWordPress;