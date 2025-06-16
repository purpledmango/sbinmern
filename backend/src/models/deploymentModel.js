import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const deploymentSchema = new Schema({
  deploymentId: {
    type: String,
    required: true,
    unique: true,
    default: () => `DEP-${uuidv4().slice(0, 8)}`
  },
  // Basic Information
  uid: { 
    type: String, 
    required: true 
  },
  deploymentType: {
    type: String,
    enum: ['wordpress', 'magento', 'custom'],
    default: 'wordpress'
  },
  deploymentName: { 
    type: String, 
    required: true 
  },
  deploymentDate: { 
    type: Date, 
    default: Date.now 
  },
  // Status Information
  status: {
    type: String,
    enum: ['initiated', 'in-progress', 'completed', 'success', 'failed', 'rolled-back'],
    default: 'initiated'
  },
  // WordPress Configuration
  wpConfig: {
    url: String,
    port: Number,
    databaseName: String,
    databaseUser: String,
    databasePassword: String,
    rootPassword: String
  }
}, { timestamps: true });

// Indexes
deploymentSchema.index({ uid: 1 });
deploymentSchema.index({ deploymentType: 1 });
deploymentSchema.index({ status: 1 });
deploymentSchema.index({ deploymentDate: -1 });

// Methods
deploymentSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this.save();
};

const Deployment = mongoose.models.Deployment || mongoose.model('Deployment', deploymentSchema);

export default Deployment;