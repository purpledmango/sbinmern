import bcrypt from 'bcryptjs';
import { NodeSSH } from 'node-ssh';
import NodeModel from "../models/infraModel.js";
import { verifySSHConnection } from '../utils/helperFunctions.js';

const ssh = new NodeSSH();
const SALT_ROUNDS = 12; // Recommended salt rounds for bcrypt

/**
 * Encrypts sensitive credentials before storage
 * @param {Object} credentials - Object containing auth credentials
 * @returns {Object} - Object with encrypted password/passphrase
 */
const encryptCredentials = async (credentials) => {
  const encrypted = { ...credentials };

  if (credentials.password) {
    encrypted.password = await bcrypt.hash(credentials.password, SALT_ROUNDS);
  }

  if (credentials.passphrase) {
    encrypted.passphrase = await bcrypt.hash(credentials.passphrase, SALT_ROUNDS);
  }

  return encrypted;
};

/**
 * Creates a new infrastructure node with encrypted credentials
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with node data
 */
export const addNewNode = async (req, res) => {
  console.log("Adding new Node route reached");
  
  try {
    // First verify the SSH connection works with provided credentials
    const sshCheck = await verifySSHConnection(req.body.credentials);

    if (!sshCheck.success) {
      return res.status(400).json({
        message: 'SSH verification failed',
        error: sshCheck.error
      });
    }

    // Encrypt credentials before saving to database
    const encryptedCredentials = await encryptCredentials(req.body.credentials);

    // Create new node with encrypted credentials
    const newNode = new NodeModel({
      ...req.body,
      credentials: encryptedCredentials, // Store encrypted credentials
      status: 'active',
      lastConnection: new Date(),
      sshStatus: sshCheck
    });

    await newNode.save();

    // Return success response without sensitive data
    res.status(201).json({
      message: 'Node created successfully',
      node: {
        ...newNode.toObject(),
        credentials: {
          username: newNode.credentials.username,
          // Omit password/passphrase
        }
      },
      sshStatus: sshCheck
    });

  } catch (error) {
    console.error("Error creating node:", error);
    res.status(400).json({
      message: 'Node creation failed',
      error: error.message
    });
  }
};

/**
 * Retrieves all nodes without sensitive credential data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with all nodes
 */
export const getAllNodes = async (req, res) => {
  console.log("Fetch all Node List triggered");
  
  try {
    // Find all nodes but exclude password fields
    const nodes = await NodeModel.find().select('-credentials.password -credentials.passphrase').lean();

    return res.status(200).json({
      message: nodes.length > 0 ? "Node List Fetched Successfully!" : "No nodes found",
      data: nodes,
      count: nodes.length
    });

  } catch (error) {
    console.error("Error fetching nodes:", error);
    return res.status(500).json({
      message: 'Fetching Node List Failed',
      error: error.message
    });
  }
};

/**
 * Retrieves all nodes with current SSH connection status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with nodes and SSH status
 */
export const getNodesWithStatus = async (req, res) => {
  try {
    // Find all nodes but exclude password fields
    const nodes = await NodeModel.find().select('-credentials.password -credentials.passphrase');

    // Check SSH status for each node (implementation would need decryption logic)
    const nodesWithStatus = await Promise.all(
      nodes.map(async (node) => {
        try {
          const sshCheck = await verifySSHConnection({
            ...node.credentials,
            // Note: you would need to implement retrieving/decrypting the password
          });
          
          return {
            ...node.toObject(),
            sshStatus: sshCheck
          };
        } catch (error) {
          return {
            ...node.toObject(),
            sshStatus: { 
              success: false, 
              error: error.message,
              lastChecked: new Date()
            }
          };
        }
      })
    );

    res.status(200).json({
      message: 'Nodes retrieved successfully',
      count: nodes.length,
      nodes: nodesWithStatus
    });

  } catch (error) {
    console.error("Error retrieving nodes with status:", error);
    res.status(500).json({
      message: 'Failed to retrieve nodes',
      error: error.message
    });
  }
};

/**
 * Gets a single node by its ID
 * @param {Object} req - Express request object with node ID parameter
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with node data
 */
export const getNodeById = async (req, res) => {
  const { nid } = req.params;
  
  try {
    const node = await NodeModel.findOne({ nid }).select('+credentials.password +credentials.passphrase');
    
    if (!node) {
      return res.status(404).json({
        message: 'Node not found'
      });
    }
    return res.status(200).json({
      message: 'Node retrieved successfully',
      data: node
    });
    
  } catch (error) {
    console.error("Error fetching node:", error);
    return res.status(500).json({
      message: 'Failed to retrieve node',
      error: error.message
    });
  }
};

/**
 * Updates a node's information
 * @param {Object} req - Express request object with node data
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with updated node
 */
export const updateNode = async (req, res) => {
  const { nid } = req.params;
  const updateData = { ...req.body };

  try {
    // Find the existing node first
    const existingNode = await NodeModel.findOne({ nid });
    if (!existingNode) {
      return res.status(404).json({
        message: 'Node not found'
      });
    }

    // Handle credential updates securely
    if (updateData.credentials) {
      // Only encrypt if new credentials are provided
      if (updateData.credentials.password) {
        updateData.credentials.password = await bcrypt.hash(
          updateData.credentials.password, 
          SALT_ROUNDS
        );
      }
      
      if (updateData.credentials.passphrase) {
        updateData.credentials.passphrase = await bcrypt.hash(
          updateData.credentials.passphrase, 
          SALT_ROUNDS
        );
      }
    }

    // Update the node
    const updatedNode = await NodeModel.findOneAndUpdate(
      { nid },
      updateData,
      { new: true, runValidators: true, select: '-credentials.password -credentials.passphrase' }
    );

    // Verify SSH connection after update if credentials changed
    if (updateData.credentials) {
      try {
        // You would need to implement decryption or use original credentials from request
        const testCredentials = {
          ...existingNode.credentials,
          ...(req.body.credentials.username && { username: req.body.credentials.username }),
          ...(req.body.credentials.password && { password: req.body.credentials.password }),
          ...(req.body.credentials.privateKey && { privateKey: req.body.credentials.privateKey }),
          ...(req.body.credentials.passphrase && { passphrase: req.body.credentials.passphrase }),
        };

        const sshCheck = await verifySSHConnection(testCredentials);
        
        // Update SSH status in database
        await NodeModel.findOneAndUpdate(
          { nid },
          {
            sshStatus: {
              connected: sshCheck.success,
              lastChecked: new Date(),
              authMethod: sshCheck.authMethod || 'none',
              error: sshCheck.error || null
            },
            status: sshCheck.success ? 'active' : 'inactive',
            lastConnection: sshCheck.success ? new Date() : existingNode.lastConnection
          }
        );
      } catch (sshError) {
        console.error('SSH verification failed:', sshError);
      }
    }

    return res.status(200).json({
      message: 'Node updated successfully',
      data: updatedNode
    });

  } catch (error) {
    console.error('Error updating node:', error);
    return res.status(500).json({
      message: 'Failed to update node',
      error: error.message
    });
  }
};

/**
 * Deletes a node by its ID
 * @param {Object} req - Express request object with node ID parameter
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with result
 */
export const deleteNode = async (req, res) => {
  const { nid } = req.params;
  
  try {
    const deletedNode = await NodeModel.findOneAndDelete({ nid });
    
    if (!deletedNode) {
      return res.status(404).json({
        message: 'Node not found'
      });
    }
    
    return res.status(200).json({
      message: 'Node deleted successfully',
      data: {
        nid: deletedNode.nid,
        name: deletedNode.name
      }
    });
    
  } catch (error) {
    console.error('Error deleting node:', error);
    return res.status(500).json({
      message: 'Failed to delete node',
      error: error.message
    });
  }
};

/**
 * Tests SSH connection to a node
 * @param {Object} req - Express request object with node credentials
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with connection status
 */
export const testConnection = async (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials) {
      return res.status(400).json({
        message: 'Credentials are required'
      });
    }
    
    const sshCheck = await verifySSHConnection(credentials);
    
    return res.status(200).json({
      message: sshCheck.success ? 'Connection successful' : 'Connection failed',
      status: sshCheck
    });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return res.status(500).json({
      message: 'Connection test failed',
      error: error.message
    });
  }
};