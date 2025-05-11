import { NodeSSH } from 'node-ssh';
import crypto from 'crypto';
import checkCredentialsAndUpdateDeployment from './checkDeploymentStatus.js';

const ssh = new NodeSSH();

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
const generateRandomPort = () => {
  return Math.floor(Math.random() * (65000 - 10000)) + 10000;
};

// Function to deploy WordPress with Docker Compose
export const deployWordPress = async (userId) => {
  try {
    // Establish the SSH connection
    await ssh.connect({
      host: '160.187.69.17',
      username: 'root',
      password: '^^M@*891))-st@Gr@@b#er@10&**(!5',
      readyTimeout: 60000
    });

    console.log('SSH Connection Established');

    // Generate random passwords and port
    const dbPassword = generateRandomPassword();
    const mysqlRootPassword = generateRandomPassword();
    const wpPort = generateRandomPort();

    // Define the base path for user directories
    const basePath = `/root/deployments/${userId}`;

    // Create necessary directories
    await ssh.execCommand(`mkdir -p ${basePath}/wordpress ${basePath}/mysql`);

    // Create Docker Compose file
    const dockerComposeContent = `version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    container_name: wp_${userId}
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
    container_name: db_${userId}
    restart: unless-stopped
    volumes:
      - mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${mysqlRootPassword}
      MYSQL_DATABASE: wpdb
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: ${dbPassword}
    command: --default-authentication-plugin=mysql_native_password
volumes:
  mysql:`;

    // Save Docker Compose file
    await ssh.execCommand(`cat > ${basePath}/docker-compose.yml << 'EOF'
${dockerComposeContent}
EOF`);

    // Save credentials
    const credentialsContent = `
WordPress Deployment Credentials:
- WordPress URL: http://160.187.69.17:${wpPort}
- WordPress Port: ${wpPort}
- DB Name: wpdb
- DB User: wpuser
- DB Password: ${dbPassword}
- MySQL Root Password: ${mysqlRootPassword}
`;
    await ssh.execCommand(`cat > ${basePath}/credentials.txt << 'EOF'
${credentialsContent}
EOF`);

    // Run Docker Compose
    console.log('Starting Docker containers...');
    await ssh.execCommand(`cd ${basePath} && docker-compose up -d`);
    await ssh.execCommand(`ufw allow ${wpPort} && docker-compose up -d`);

    // Verify deployment
    await new Promise(resolve => setTimeout(resolve, 10000));
    const status = await ssh.execCommand(`cd ${basePath} && docker-compose ps`);
    console.log('Container status:', status.stdout);

    // Clean up
    ssh.dispose();

    return {
      success: true,
      url: `http://160.187.69.17:${wpPort}`,
      port: wpPort,
      credentials: {
        dbName: 'wpdb',
        dbUser: 'wpuser',
        dbPassword: dbPassword,
        mysqlRootPassword: mysqlRootPassword
      }
    };
    
  } catch (error) {
    console.error('Error during deployment:', error);
    if (ssh.isConnected()) {
      ssh.dispose();
    }
    return {
      success: false,
      error: error.message
    };
  }
};

// Run the deployment
// deployWordPress('user22')
//   .then(result => { 
//     if (result.success) {
//       console.log('Deployment successful!');
//       console.log(`Access WordPress at: ${result.url}`);
//       console.log('Credentials saved in the deployment directory.');
//     } else {
//       console.error('Deployment failed:', result.error);
//     }
//   })
//   .catch(err => {
//     console.error('Unhandled error:', err);
//   });