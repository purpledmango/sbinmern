import { NodeSSH } from 'node-ssh';

import NodeModel from '../models/infraModel.js';


const checkCredentialsAndUpdateDeployment =async (deploymentId)=> {
    const ssh = new NodeSSH();
    
    try {
      const nodeMachine = await NodeModel.findOne({nid: "210Sj990"}).select('+credentials.password').exec();
      // Connect to the server
      await ssh.connect({
      host: nodeMachine.credentials.host,
      username: nodeMachine.credentials.username || "root",
      password: nodeMachine.credentials.password,
      readyTimeout: 60000
      });

  
      // Check if credentials file exists
      const filePath = `/root/deployments/${deploymentId}/credentials.txt`;
      const fileExists = await ssh.execCommand(`[ -f "${filePath}" ] && echo "exists" || echo "not exists"`);
      
      if (fileExists.stdout.trim() !== 'exists') {
        throw new Error('Credentials file not found');
      }
  
      // Read the file contents
      const fileContents = await ssh.execCommand(`cat ${filePath}`);
      const credentialsText = fileContents.stdout;
  
      // Parse the credentials
      const credentials = {};
      const lines = credentialsText.split('\n');
      lines.forEach(line => {
        if (line.includes('WordPress URL:')) {
          // Split on first colon and take everything after it
          credentials.url = line.split(':').slice(1).join(':').trim();
        } else if (line.includes('WordPress Port:')) {
          // Get the port number after the last colon
          credentials.port = parseInt(line.split(':').pop().trim());
        } else if (line.includes('DB Name:')) {
          credentials.databaseName = line.split(':')[1].trim();
        } else if (line.includes('DB User:')) {
          credentials.databaseUser = line.split(':')[1].trim();
        } else if (line.includes('DB Password:')) {
          credentials.databasePassword = line.split(':')[1].trim();
        } else if (line.includes('MySQL Root Password:')) {
          credentials.rootPassword = line.split(':')[1].trim();
        }
      });
      console.log("credntails url", credentials.url)
      console.log("credentials", credentials)
      // Update the deployment in MongoDB
      const updatedDeployment = await Deployment.findOneAndUpdate(
        { deploymentId },
        {
          $set: {
            status: 'completed',
            wpConfig: {
              url: credentials.url,
              port: credentials.port,
              databaseName: credentials.databaseName,
              databaseUser: credentials.databaseUser,
              databasePassword: credentials.databasePassword,
              rootPassword: credentials.rootPassword
            }
          }
        },
        { new: true }
      );
  
      if (!updatedDeployment) {
        throw new Error('Deployment not found');
      }
  
      return updatedDeployment;
  
    } catch (error) {
      // Update deployment status to failed if something goes wrong
      await Deployment.findOneAndUpdate(
        { deploymentID: deploymentId },
        { $set: { status: 'failed' } }
      );
      throw error;
    } finally {
      ssh.dispose();
    }
  }
  
  export default checkCredentialsAndUpdateDeployment;