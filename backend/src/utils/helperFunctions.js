import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

/**
 * Verifies SSH connection status using available authentication methods
 * @param {Object} credentials - SSH connection credentials
 * @returns {Promise<Object>} Connection status object
 */
export const verifySSHConnection = async (credentials) => {
  // Validate required parameters
  if (!credentials?.host || !credentials?.username) {
    return {
      success: false,
      error: 'Missing required credentials (host and user)',
      statusCode: 400
    };
  }

  // Configure connection options
  const connectionOptions = {
    host: credentials.host,
    port: credentials.port || 22,
    username: credentials.username,
    readyTimeout: 10000, // 10 second timeout
    connectTimeout: 10000
  };

  // Add authentication method (priority: privateKey > password)
  if (credentials.privateKey) {
    connectionOptions.privateKey = credentials.privateKey;
    if (credentials.passphrase) {
      connectionOptions.passphrase = credentials.passphrase;
    }
  } else if (credentials.password) {
    connectionOptions.password = credentials.password;
  } else {
    return {
      success: false,
      error: 'No authentication method provided (need password or privateKey)',
      statusCode: 401
    };
  }

  try {
    // Attempt connection
    await ssh.connect(connectionOptions);
    
    // Verify with a simple command
    const result = await ssh.execCommand('echo "Connection test"');
    
    if (result.code !== 0) {
      throw new Error(`Command failed: ${result.stderr}`);
    }

    return {
      success: true,
      status: 'connected',
      host: credentials.host,
      authMethod: credentials.privateKey ? 'privateKey' : 'password'
    };
    
  } catch (error) {
    return {
      success: false,
      status: 'disconnected',
      error: error.message,
      host: credentials.host,
      statusCode: 502 // Bad Gateway
    };
  } finally {
    // Clean up connection
    if (ssh.isConnected()) {
      ssh.dispose();
    }
  }
};