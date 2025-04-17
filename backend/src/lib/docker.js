// lib/docker.js
const generateDockerCompose = (config) => {
    return `version: '3.7'
  services:
    ${config.instanceId}_wordpress:
      image: wordpress:latest
      restart: always
      ports:
        - "${config.port}:80"
      environment:
        WORDPRESS_DB_HOST: ${config.instanceId}_db
        WORDPRESS_DB_USER: ${config.dbUser}
        WORDPRESS_DB_PASSWORD: ${config.dbPassword}
        WORDPRESS_DB_NAME: ${config.dbName}
      volumes:
        - ${config.volumePrefix}_wordpress:/var/www/html
      networks:
        - ${config.instanceId}_net
  
    ${config.instanceId}_db:
      image: mariadb:latest
      restart: always
      environment:
        MYSQL_DATABASE: ${config.dbName}
        MYSQL_USER: ${config.dbUser}
        MYSQL_PASSWORD: ${config.dbPassword}
        MYSQL_ROOT_PASSWORD: ${config.rootPassword}
      volumes:
        - ${config.volumePrefix}_db:/var/lib/mysql
      networks:
        - ${config.instanceId}_net
  
  volumes:
    ${config.volumePrefix}_wordpress:
    ${config.volumePrefix}_db:
  
  networks:
    ${config.instanceId}_net:
      name: ${config.instanceId}_net`;
  };

  export default generateDockerCompose;