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
    username: credentials.username || "root",
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

export function parseDockerStats(statsOutput) {
    const result = {};
    
    try {
        // Split into lines and remove empty lines
        console.log("test stats", statsOutput.split())
        const lines = statsOutput.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error("Insufficient data - need at least header row and one data row");

        // Extract headers and clean them
        const headers = lines[0].trim().split(/\s{2,}/).map(h => h.trim());
        
        // Process each container line
        const containers = lines.slice(1).map(line => {
            const values = line.trim().split(/\s{2,}/).map(v => v.trim());
            if (values.length !== headers.length) {
                console.warn(`Skipping malformed line: ${line}`);
                return null;
            }

            const container = {};
            headers.forEach((header, i) => {
                // Convert header to valid key (e.g., "CPU %" -> "cpuPercent")
                const key = header.toLowerCase()
                    .replace(/%/g, 'percent')
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                
                container[key] = values[i] || null;
            });
            return container;
        }).filter(Boolean);

        if (containers.length === 0) throw new Error("No valid container data found");

        // Convert to more usable object structure
        result.containers = containers.map(container => {
            // Helper to parse size strings (e.g., "154.8MiB" -> { value: 154.8, unit: "MiB", bytes: 162319564.8 })
            const parseSize = (sizeStr) => {
                if (!sizeStr) return null;
                
                const match = sizeStr.match(/^([\d.]+)([KMGTP]?i?B)$/i);
                if (!match) return { raw: sizeStr };

                const value = parseFloat(match[1]);
                const unit = match[2];
                let bytes = value;

                // Convert to bytes
                switch (unit.toUpperCase()) {
                    case 'KB': bytes *= 1024; break;
                    case 'MB': bytes *= 1024 * 1024; break;
                    case 'GB': bytes *= 1024 * 1024 * 1024; break;
                    case 'TB': bytes *= 1024 * 1024 * 1024 * 1024; break;
                    case 'KIB': bytes *= 1024; break;
                    case 'MIB': bytes *= 1024 * 1024; break;
                    case 'GIB': bytes *= 1024 * 1024 * 1024; break;
                    case 'TIB': bytes *= 1024 * 1024 * 1024 * 1024; break;
                }

                return {
                    raw: sizeStr,
                    value,
                    unit,
                    bytes
                };
            };

            // Parse memory usage (e.g., "154.8MiB / 31.29GiB")
            const [memUsage, memLimit] = container.mem_usage_limit?.split(' / ') || [];
            
            // Parse network I/O (e.g., "183kB / 208kB")
            const [netIn, netOut] = container.net_io?.split(' / ') || [];
            
            // Parse block I/O (e.g., "0B / 8.19kB")
            const [blockIn, blockOut] = container.block_io?.split(' / ') || [];

            return {
                id: container.container_id,
                name: container.name,
                cpu: {
                    percent: parseFloat(container.cpu_percent) || 0,
                    raw: container.cpu_percent
                },
                memory: {
                    usage: parseSize(memUsage),
                    limit: parseSize(memLimit),
                    percent: parseFloat(container.mem_percent) || 0,
                    raw: container.mem_usage_limit
                },
                network: {
                    in: parseSize(netIn),
                    out: parseSize(netOut),
                    raw: container.net_io
                },
                block: {
                    in: parseSize(blockIn),
                    out: parseSize(blockOut),
                    raw: container.block_io
                },
                processes: {
                    count: parseInt(container.pids, 10) || 0,
                    raw: container.pids
                },
                raw: container // Include all raw data
            };
        });

    } catch (error) {
        console.error(`Error parsing Docker stats: ${error.message}`);
        result.error = error.message;
        result.raw = statsOutput;
    }

    return result;
}




export const findAvailablePort = async (ssh_, maxAttempts = 100) => {
  const startingPort = 8263;
  let currentPort = startingPort;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const portStatus = await ssh_.execCommand(`netstat -tulpn | grep ${currentPort}`);
      const isActive = portStatus.stdout.includes(`:${currentPort}`);
      
      if (!isActive) {
        return currentPort;
      }
      
      currentPort++;
      attempts++;
    } catch (error) {
      // If the grep command fails (no matches), it might return stderr
      // In many systems, grep returns non-zero status when no matches are found
      if (error.stderr === '') {
        return currentPort;
      }
      throw error;
    }
  }

  // Explicitly throw an error if no port found
  throw new Error(`No available port found after ${maxAttempts} attempts`);
};
