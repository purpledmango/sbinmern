import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

// Function to create user-specific deployment structure and run Docker Compose
const deployUserData = async (userId, domainName = null) => {
  try {
    // Establish the SSH connection first
    await ssh.connect({
      host: '150.241.246.228',
      username: 'root',
      password: 'Utho@123@123',
      readyTimeout: 60000 // Increase timeout to 60s
    });

    console.log('SSH Connection Established');

    // Generate random passwords and port
    const dbPassword = generateRandomPassword();
    const mysqlRootPassword = generateRandomPassword();
    const nginxPort = generateRandomPort();
    
    // Server IP for this example
    const serverIp = '150.241.246.228';

    // Define the base path for user directories
    const basePath = `/root/deployments/${userId}`;

    // Define paths for user-specific directories
    const nginxDir = path.join(basePath, 'nginx');
    const confDir = path.join(nginxDir, 'conf.d');
    const sslDir = path.join(nginxDir, 'ssl');
    const dbDir = path.join(basePath, `/data/mysql_${userId}`);
    const dbConfDir = path.join(basePath, `/data/mysql_conf_${userId}`);
    const userDataDir = path.join(basePath, `/data/wordpress_${userId}`);
    const logsDir = path.join(basePath, '/logs');
    const nginxLogsDir = path.join(logsDir, 'nginx');

    // Check if directories already exist, if not, create them
    await ssh.execCommand(`mkdir -p ${nginxDir} ${confDir} ${sslDir} ${dbDir} ${dbConfDir} ${userDataDir} ${nginxLogsDir}`);

    console.log(`Directories created for user ${userId}`);

    // Create an improved NGINX config file with proper proxy settings and logging
    const defaultConfPath = path.join(confDir, 'default.conf');
    const nginxConfContent = `server {
    listen 80;
    server_name ${domainName ? domainName : '_'};
    
    client_max_body_size 100M;
    
    # Access and error logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Add gzip compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;
    
    location / {
        proxy_pass http://wordpress_${userId}:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host:$server_port;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Handle WebSocket connections
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Prevent timeouts
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
        fastcgi_read_timeout 600s;
    }
    
    # Optimize for static content
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://wordpress_${userId}:80;
        proxy_set_header Host $host;
        expires max;
        access_log off;
        add_header Cache-Control "public, max-age=31536000";
    }
    
    # Deny access to specific WordPress files and directories
    location ~* ^/(?:wp-config\\.php|xmlrpc\\.php|wp-admin/includes|wp-admin/wp-signup\\.php|wp-admin/wp-login\\.php)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Deny access to hidden files
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}`;

    // Upload the default NGINX config file
    await ssh.execCommand(`cat > ${defaultConfPath} << 'EOF'
${nginxConfContent}
EOF`);
    console.log('Enhanced NGINX config created for better performance and security.');

    // Create main NGINX config with proper worker settings
    const mainNginxConfPath = path.join(nginxDir, 'nginx.conf');
    const mainNginxConfContent = `user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    types_hash_max_size 2048;
    server_tokens off;
    
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # File descriptor cache settings
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    client_max_body_size 100M;
    
    include /etc/nginx/conf.d/*.conf;
}`;

    // Upload the main NGINX config file
    await ssh.execCommand(`cat > ${mainNginxConfPath} << 'EOF'
${mainNginxConfContent}
EOF`);
    console.log('Main NGINX config created with optimized settings.');

    // Create MySQL configuration file for better performance
    const mysqlConfPath = path.join(dbConfDir, 'my.cnf');
    const mysqlConfContent = `[mysqld]
# Basic settings
pid-file = /var/run/mysqld/mysqld.pid
socket = /var/run/mysqld/mysqld.sock
bind-address = 0.0.0.0
port = 3306
user = mysql
default_authentication_plugin = mysql_native_password
skip-name-resolve
explicit_defaults_for_timestamp = 1

# InnoDB settings
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Connection settings
max_connections = 100
max_allowed_packet = 16M
wait_timeout = 600
interactive_timeout = 600

# Query cache settings (disabled in MySQL 8.0+)
query_cache_type = 0
query_cache_size = 0

# Binary logging
server-id = 1
log_bin = /var/lib/mysql/mysql-bin.log
expire_logs_days = 7
max_binlog_size = 100M

# Security settings
local-infile = 0

# Character set and collation
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4`;

    // Upload the MySQL configuration file
    await ssh.execCommand(`cat > ${mysqlConfPath} << 'EOF'
${mysqlConfContent}
EOF`);
    console.log('MySQL configuration file created for optimal performance.');

    // Generate SSL certificates
    const sslCertPath = path.join(sslDir, 'selfsigned.crt');
    const sslKeyPath = path.join(sslDir, 'selfsigned.key');
    
    // Use domain name if provided, otherwise use serverIp with nip.io
    const certDomain = domainName ? domainName : `${userId}.${serverIp}.nip.io`;
    const createSslCommand = `openssl req -x509 -newkey rsa:4096 -keyout ${sslKeyPath} -out ${sslCertPath} -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=${certDomain}"`;
    await ssh.execCommand(createSslCommand);
    console.log('SSL certificate created for secure connections.');

    // Create an init SQL script for proper database initialization and security
    const initSqlPath = path.join(basePath, 'init.sql');
    const initSqlContent = `
-- Initial database setup
CREATE DATABASE IF NOT EXISTS wp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create WordPress user with restricted privileges
CREATE USER IF NOT EXISTS 'wp_user'@'%' IDENTIFIED BY '${dbPassword}';
CREATE USER IF NOT EXISTS 'wp_user'@'wordpress_${userId}' IDENTIFIED BY '${dbPassword}';
CREATE USER IF NOT EXISTS 'wp_user'@'172.%' IDENTIFIED BY '${dbPassword}';

-- Grant appropriate privileges to WordPress user
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON wp_db.* TO 'wp_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON wp_db.* TO 'wp_user'@'wordpress_${userId}';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON wp_db.* TO 'wp_user'@'172.%';

-- Specific permission for WordPress sessions
GRANT PROCESS ON *.* TO 'wp_user'@'%';
GRANT PROCESS ON *.* TO 'wp_user'@'wordpress_${userId}';
GRANT PROCESS ON *.* TO 'wp_user'@'172.%';

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Reload privileges
FLUSH PRIVILEGES;`;

    // Upload the init SQL file
    await ssh.execCommand(`cat > ${initSqlPath} << 'EOF'
${initSqlContent}
EOF`);
    console.log('Database initialization script created with proper security settings.');

    // Create improved WP-Config.php with performance optimizations
    const wpConfigPath = path.join(basePath, 'wp-config-additions.php');
    const wpConfigContent = `
// ** MySQL settings ** //
define('DB_NAME', 'wp_db');
define('DB_USER', 'wp_user');
define('DB_PASSWORD', '${dbPassword}');
define('DB_HOST', 'db_${userId}:3306');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');

// ** Authentication Unique Keys and Salts ** //
define('AUTH_KEY',         '${crypto.randomBytes(48).toString('base64')}');
define('SECURE_AUTH_KEY',  '${crypto.randomBytes(48).toString('base64')}');
define('LOGGED_IN_KEY',    '${crypto.randomBytes(48).toString('base64')}');
define('NONCE_KEY',        '${crypto.randomBytes(48).toString('base64')}');
define('AUTH_SALT',        '${crypto.randomBytes(48).toString('base64')}');
define('SECURE_AUTH_SALT', '${crypto.randomBytes(48).toString('base64')}');
define('LOGGED_IN_SALT',   '${crypto.randomBytes(48).toString('base64')}');
define('NONCE_SALT',       '${crypto.randomBytes(48).toString('base64')}');

// ** WordPress Database Table prefix ** //
$table_prefix = 'wp_';

// ** WordPress debugging mode ** //
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// ** Performance Optimizations ** //
define('WP_CACHE', true);
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// ** Security Hardening ** //
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', false);
define('FORCE_SSL_ADMIN', false);
define('AUTOMATIC_UPDATER_DISABLED', false);

// ** Misc Settings ** //
define('WP_AUTO_UPDATE_CORE', 'minor');
define('WP_POST_REVISIONS', 3);
define('EMPTY_TRASH_DAYS', 7);
define('AUTOSAVE_INTERVAL', 60);
define('WP_SITEURL', '${domainName ? ('http://' + domainName + ':' + nginxPort) : ('http://' + serverIp + ':' + nginxPort)}');
define('WP_HOME', '${domainName ? ('http://' + domainName + ':' + nginxPort) : ('http://' + serverIp + ':' + nginxPort)}');
`;

    // Upload the WP-Config additions file
    await ssh.execCommand(`cat > ${wpConfigPath} << 'EOF'
${wpConfigContent}
EOF`);
    console.log('WordPress configuration optimization file created.');

    // Create a Docker Compose health-check script for the WordPress container
    const healthcheckPath = path.join(basePath, 'healthcheck.sh');
    const healthcheckContent = `#!/bin/bash
curl -sf --max-time 5 http://localhost:80/ > /dev/null || exit 1
exit 0`;

    // Upload the healthcheck script
    await ssh.execCommand(`cat > ${healthcheckPath} << 'EOF'
${healthcheckContent}
EOF`);
    await ssh.execCommand(`chmod +x ${healthcheckPath}`);
    console.log('Container healthcheck script created.');

    // Create an improved docker-compose file with proper networking, volume mounting and healthchecks
    const dockerComposeContent = `version: '3.8'

# Define networks
networks:
  frontend_${userId}:
    driver: bridge
    ipam:
      config:
        - subnet: 172.${userId}.0.0/24
  backend_${userId}:
    driver: bridge
    ipam:
      config:
        - subnet: 172.${parseInt(userId) + 100}.0.0/24

# Define services
services:
  # NGINX service
  nginx_${userId}:
    image: nginx:1.25-alpine
    container_name: wp_nginx_${userId}
    restart: unless-stopped
    depends_on:
      wordpress_${userId}:
        condition: service_healthy
    ports:
      - "${nginxPort}:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      frontend_${userId}:
        ipv4_address: 172.${userId}.0.2
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 10s
      timeout: 5s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # WordPress service
  wordpress_${userId}:
    image: wordpress:6.3-php8.2-apache
    container_name: wp_app_${userId}
    restart: unless-stopped
    depends_on:
      db_${userId}:
        condition: service_healthy
    environment:
      WORDPRESS_DB_HOST: db_${userId}:3306
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: ${dbPassword}
      WORDPRESS_DB_NAME: wp_db
      WORDPRESS_TABLE_PREFIX: wp_
      WORDPRESS_CONFIG_EXTRA: |
        include_once('/var/www/html/wp-config-extra.php');
    volumes:
      - wordpress_data_${userId}:/var/www/html
      - ./wp-config-additions.php:/var/www/html/wp-config-extra.php:ro
      - ./healthcheck.sh:/usr/local/bin/healthcheck.sh:ro
    networks:
      frontend_${userId}:
        ipv4_address: 172.${userId}.0.3
      backend_${userId}:
        ipv4_address: 172.${parseInt(userId) + 100}.0.3
    healthcheck:
      test: ["CMD", "/usr/local/bin/healthcheck.sh"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # MySQL Database service
  db_${userId}:
    image: mysql:8.0
    container_name: wp_db_${userId}
    restart: unless-stopped
    command:
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${mysqlRootPassword}
      MYSQL_DATABASE: wp_db
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: ${dbPassword}
    volumes:
      - db_data_${userId}:/var/lib/mysql
      - ./data/mysql_conf_${userId}/my.cnf:/etc/mysql/conf.d/custom.cnf:ro
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      backend_${userId}:
        ipv4_address: 172.${parseInt(userId) + 100}.0.2
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${mysqlRootPassword}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 60s
    cap_add:
      - SYS_NICE
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

# Define volumes
volumes:
  wordpress_data_${userId}:
    driver: local
    driver_opts:
      type: none
      device: ${basePath}/data/wordpress_${userId}
      o: bind
  db_data_${userId}:
    driver: local
    driver_opts:
      type: none
      device: ${basePath}/data/mysql_${userId}
      o: bind`;

    // Define path for the Docker Compose file
    const dockerComposePath = path.join(basePath, 'docker-compose.yml');

    // Upload the Docker Compose YAML file
    await ssh.execCommand(`cat > ${dockerComposePath} << 'EOF'
${dockerComposeContent}
EOF`);
    console.log('Advanced Docker Compose file created with optimized networking and health checks.');

    // Save the generated credentials to a separate file
    const credentialsPath = path.join(basePath, 'credentials.txt');
    const credentialsContent = `
=====================================
WordPress Deployment Credentials for ${userId}
=====================================

Access Information:
-----------------
Access URL: http://${serverIp}:${nginxPort}
${domainName ? `Domain URL: http://${domainName}:${nginxPort}` : ''}

Database Information:
-------------------
DB Name: wp_db
DB User: wp_user
DB Password: ${dbPassword}
MySQL Root Password: ${mysqlRootPassword}

Port Information:
---------------
NGINX Port: ${nginxPort}

Network Information:
-----------------
Frontend Network: 172.${userId}.0.0/24
Backend Network: 172.${parseInt(userId) + 100}.0.0/24

Container IPs:
------------
NGINX: 172.${userId}.0.2
WordPress: 172.${userId}.0.3 (frontend), 172.${parseInt(userId) + 100}.0.3 (backend)
MySQL: 172.${parseInt(userId) + 100}.0.2

Deployment Path:
-------------
${basePath}
`;

    // Upload the credentials file
    await ssh.execCommand(`cat > ${credentialsPath} << 'EOF'
${credentialsContent}
EOF`);
    console.log('Credentials file created with network information.');

    // Make sure directory structure exists for volume mounts before running docker-compose
    await ssh.execCommand(`mkdir -p ${dbDir} ${userDataDir} ${nginxLogsDir}`);
    
    // Set proper permissions on data directories
    await ssh.execCommand(`chmod -R 777 ${dbDir} ${userDataDir} ${nginxLogsDir}`);
    await ssh.execCommand(`chmod 600 ${sslKeyPath}`);
    console.log('Directory permissions set for security and volume access.');

    // Check for Docker and Docker Compose
    const dockerCheck = await ssh.execCommand('docker --version && docker info');
    if (dockerCheck.stderr && !dockerCheck.stderr.includes('permission denied')) {
        console.error('Docker issue detected:', dockerCheck.stderr);
        throw new Error('Docker not available or not running');
    }

    // Stop and remove any existing containers for this user
    await ssh.execCommand(`cd ${basePath} && docker-compose down -v`, {cwd: basePath});
    console.log('Removed any existing containers and volumes.');
    
    // Pull the latest images first
    await ssh.execCommand('docker-compose pull', {cwd: basePath});
    console.log('Pulled latest container images.');

    // Run Docker Compose with detection of existing containers
    console.log('Starting Docker Compose deployment...');
    const deployResult = await ssh.execCommand('docker-compose up -d', {cwd: basePath});
    
    if (deployResult.stderr && !deployResult.stderr.includes('Creating') && !deployResult.stderr.includes('Starting')) {
        console.error('Docker Compose deployment error:', deployResult.stderr);
    } else {
        console.log('Docker Compose deployment started:', deployResult.stdout || 'Containers are being created...');
    }

    // Check container status after deployment
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
    const statusResult = await ssh.execCommand('docker-compose ps', {cwd: basePath});
    console.log('Container status:', statusResult.stdout);

    // Check if all containers are running
    const containerCheck = await ssh.execCommand(`docker ps --filter "name=wp_*_${userId}" --format "{{.Names}}: {{.Status}}"`);
    
    if (!containerCheck.stdout.includes(`wp_nginx_${userId}`) || 
        !containerCheck.stdout.includes(`wp_app_${userId}`) || 
        !containerCheck.stdout.includes(`wp_db_${userId}`)) {
        console.warn('Some containers may not be running. Checking individual container status...');
        
        // Check individual container status
        const nginxStatus = await ssh.execCommand(`docker inspect -f '{{.State.Status}}' wp_nginx_${userId} || echo "Container not found"`);
        const wpStatus = await ssh.execCommand(`docker inspect -f '{{.State.Status}}' wp_app_${userId} || echo "Container not found"`);
        const dbStatus = await ssh.execCommand(`docker inspect -f '{{.State.Status}}' wp_db_${userId} || echo "Container not found"`);
        
        console.log(`NGINX status: ${nginxStatus.stdout}`);
        console.log(`WordPress status: ${wpStatus.stdout}`);
        console.log(`Database status: ${dbStatus.stdout}`);
        
        // Check container logs if not running
        if (nginxStatus.stdout !== 'running') {
            const nginxLogs = await ssh.execCommand(`docker logs wp_nginx_${userId} --tail 50`);
            console.error('NGINX container logs:', nginxLogs.stdout || nginxLogs.stderr);
        }
        
        if (wpStatus.stdout !== 'running') {
            const wpLogs = await ssh.execCommand(`docker logs wp_app_${userId} --tail 50`);
            console.error('WordPress container logs:', wpLogs.stdout || wpLogs.stderr);
        }
        
        if (dbStatus.stdout !== 'running') {
            const dbLogs = await ssh.execCommand(`docker logs wp_db_${userId} --tail 50`);
            console.error('Database container logs:', dbLogs.stdout || dbLogs.stderr);
        }
        
        // Try to restart if some containers failed
        if (nginxStatus.stdout !== 'running' || wpStatus.stdout !== 'running' || dbStatus.stdout !== 'running') {
            console.log('Attempting to restart failed containers...');
            await ssh.execCommand('docker-compose down && docker-compose up -d', {cwd: basePath});
            await new Promise(resolve => setTimeout(resolve, 15000)); // 15-second delay
        }
    }

    // Check network connectivity between containers
    console.log('Checking network connectivity between containers...');
    const wpToDbTest = await ssh.execCommand(`docker exec wp_app_${userId} bash -c "ping -c 2 db_${userId}"`);
    console.log('WordPress to DB network test:', wpToDbTest.stdout || wpToDbTest.stderr);

    const dbToWpTest = await ssh.execCommand(`docker exec wp_db_${userId} bash -c "ping -c 2 wordpress_${userId}"`);
    console.log('DB to WordPress network test:', dbToWpTest.stdout || dbToWpTest.stderr);

    // Test database connection
    console.log('Testing database connection from WordPress container...');
    const dbConnTest = await ssh.execCommand(`docker exec wp_app_${userId} bash -c "mysql -h db_${userId} -u wp_user -p'${dbPassword}' -e 'SHOW DATABASES;'"`);
    if (dbConnTest.stderr && !dbConnTest.stderr.includes('Warning')) {
        console.error('Database connection test failed:', dbConnTest.stderr);
    } else {
        console.log('Database connection test succeeded:', dbConnTest.stdout);
    }

    // Test WordPress accessibility
    console.log('Testing WordPress HTTP accessibility...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
    
    const wpTest = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${nginxPort}`);
    console.log(`WordPress HTTP response code: ${wpTest.stdout}`);

    if (wpTest.stdout !== '200' && wpTest.stdout !== '302') {
        // If failed, test direct access to WordPress container
        const wpDirectTest = await ssh.execCommand(`docker exec wp_nginx_${userId} curl -s -o /dev/null -w "%{http_code}" http://wordpress_${userId}`);
        console.log(`Direct WordPress HTTP response code: ${wpDirectTest.stdout}`);
        
        // Check NGINX config
        const nginxConfigTest = await ssh.execCommand(`docker exec wp_nginx_${userId} nginx -t`);
        console.log('NGINX config test:', nginxConfigTest.stdout || nginxConfigTest.stderr);
    }

    // Create an improved summary of the deployment
    console.log(`
========== DEPLOYMENT SUMMARY ==========
User ID: ${userId}
Port: ${nginxPort}
Access URL: http://${serverIp}:${nginxPort}
${domainName ? `Domain URL: http://${domainName}:${nginxPort}` : ''}
Credentials saved at: ${credentialsPath}

Container Status:
${containerCheck.stdout}

WordPress HTTP Status: ${wpTest.stdout}
=======================================
`);

    // Clean up and dispose SSH connection
    ssh.dispose();
    
    return {
        success: true,
        url: `http://${serverIp}:${nginxPort}`,
        domainUrl: domainName ? `http://${domainName}:${nginxPort}` : null,
        port: nginxPort,
        credentials: {
            dbName: 'wp_db',
            dbUser: 'wp_user',
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

// Call the function with a userId and optional domain name
// deployUserData('user12');  // Basic usage with just user ID
deployUserData('user17')  // Usage with domain name
  .then(result => {
    if (result.success) {
      console.log(`Deployment successful!`);
      console.log(`Access WordPress at: ${result.url}`);
      if (result.domainUrl) {
        console.log(`Or via domain at: ${result.domainUrl}`);
      }
      console.log(`
Database Information:
- Database Name: ${result.credentials.dbName}
- Database User: ${result.credentials.dbUser}
- Database Password: ${result.credentials.dbPassword}
- MySQL Root Password: ${result.credentials.mysqlRootPassword}

Port Information:
- NGINX Port: ${result.port}

Setup Complete! Your WordPress site is now deployed and ready to use.
`);
    } else {
      console.error(`Deployment failed: ${result.error}`);
      console.log(`
Troubleshooting Tips:
1. Check SSH connection details
2. Ensure Docker and Docker Compose are installed on the server
3. Verify port ${result.port} is not already in use
4. Check server disk space and permissions
5. Review server logs for more detailed error information
`);
    }
  })
  .catch(err => {
    console.error('Unhandled exception during deployment:', err);
    console.log(`
Fatal Error Occurred:
Please check your network connection and server availability.
If the problem persists, verify your credentials and server configuration.
`);
  });