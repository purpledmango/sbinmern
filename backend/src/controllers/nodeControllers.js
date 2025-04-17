import NodeModel from '../models/infraModel.js';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';
import si from 'systeminformation';
import { NodeSSH } from 'node-ssh';

const execPromise = util.promisify(exec);

// CRUD Operations
export const createNode = async (req, res) => {
  try {
    const newNode = new NodeModel(req.body);
    console.log("created deatails", req.body);
    await newNode.save();
    res.status(201).json(newNode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNodes = async (req, res) => {
  try {
    const nodes = await NodeModel.find();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNode = async (req, res) => {
  try {
    const node = await NodeModel.findById(req.params.id);
    if (!node) return res.status(404).json({ message: 'Node not found' });
    res.json(node);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNode = async (req, res) => {
  try {
    const updatedNode = await NodeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNode) return res.status(404).json({ message: 'Node not found' });
    res.json(updatedNode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNode = async (req, res) => {
  try {
    const deletedNode = await NodeModel.findByIdAndDelete(req.params.id);
    if (!deletedNode) return res.status(404).json({ message: 'Node not found' });
    res.json({ message: 'Node deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SSH Connection Check using the stored password
export const checkSSHConnection = async (req, res) => {
  try {
    const node = await NodeModel.findById(req.params.id);
    if (!node) return res.status(404).json({ message: 'Node not found' });
    console.log("The node", node)
    const { host, port, username, encryptedPassword } = node;
    console.log("Creds", host, port, username, encryptedPassword)
    const ssh = new NodeSSH();

    await ssh.connect({
      host,
      port,
      username,
    password: encryptedPassword
    });

    const result = await ssh.execCommand('echo "SSH connection successful"');
    ssh.dispose();
    console.log("Results", result)

    res.json({ 
      status: 'success',
      message: result.stdout
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'SSH connection failed',
      error: error.message 
    });

    console.log("Error occured", error)
  }
};

// Server Performance Metrics using the stored password
export const getServerMetrics = async (req, res) => {
  try {
    // For local server metrics
    if (req.params.id === 'local') {
      const metrics = await getLocalMetrics();
      return res.json(metrics);
    }

    const node = await NodeModel.findById(req.params.id);
    if (!node) return res.status(404).json({ message: 'Node not found' });

    const { host, port, username, encryptedPassword } = node;
    const ssh = new NodeSSH();

    await ssh.connect({
      host,
      port, 
      username,
      password:encryptedPassword 
    });

    // Execute the commands to get metrics
    const cpuCommand = await ssh.execCommand("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'");
    const memCommand = await ssh.execCommand("free -m | awk '/Mem:/ { printf(\"%.2f\", $3/$2*100) }'");
    const diskCommand = await ssh.execCommand("df -h / | awk '/\\// {print $5}'");
    const uptimeCommand = await ssh.execCommand("uptime -p");

    ssh.dispose();

    const metrics = {
      cpu: `${cpuCommand.stdout.trim()}%`,
      memory: `${memCommand.stdout.trim()}%`,
      disk: diskCommand.stdout.trim(),
      uptime: uptimeCommand.stdout.trim()
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get server metrics',
      error: error.message 
    });
  }
};

// Helper functions
async function getLocalMetrics() {
  const cpuUsage = await si.currentLoad();
  const memUsage = await si.mem();
  const diskUsage = await si.fsSize();
  const uptime = os.uptime();

  return {
    cpu: `${cpuUsage.currentLoad.toFixed(2)}%`,
    memory: `${((memUsage.used / memUsage.total) * 100).toFixed(2)}%`,
    disk: diskUsage.find(d => d.mount === '/') ? diskUsage.find(d => d.mount === '/').use : 'N/A',
    uptime: formatUptime(uptime)
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${mins}m`;
}