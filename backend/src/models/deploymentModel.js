import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Check if Counter model already exists to prevent OverwriteModelError
const Counter = mongoose.models.Counter || 
  mongoose.model('Counter', new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
  }));

const deploymentSchema = new Schema({
  deploymentId: {
    type: String,
    required: true,
    unique: true
  },
  // Basic Information
  uid: {
    type: String,
    required: true
  },
  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true
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
    enum: ['initiated', 'in-progress', 'completed', 'failed', 'rolled-back'],
    default: 'initiated'
  },
  statusMessage: {
    type: String
  },
  
  // Container Information
  containerId: {
    type: String
  },
  containerName: {
    type: String
  },
  image: {
    type: String,
    default: 'wordpress:latest'
  },
  
  // WordPress Configuration
  wpConfig: {
    databaseName: String,
    databaseUser: String,
    databasePassword: String,
    tablePrefix: {
      type: String,
      default: 'wp_'
    },
    adminEmail: String,
    siteName: String,
    siteUrl: String
  },
  
  // Networking
  ports: {
    http: {
      type: Number,
      default: 80
    },
    https: {
      type: Number,
      default: 443
    },
    mysqlPort: {
      type: Number,
      default: 3306
    }
  },
  
  // Volumes
  volumeMappings: [{
    hostPath: String,
    containerPath: String,
    description: String
  }],
  
  // Performance & Resources
  resources: {
    memoryLimit: String,
    cpuLimit: String,
    restartPolicy: {
      type: String,
      default: 'always'
    }
  },
  
  // Deployment Process Data
  deploymentDuration: {
    type: Number // in seconds
  },
  startTime: Date,
  endTime: Date,
  
  // Deployment Logs
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'debug']
    },
    message: String
  }],
  
  // User who initiated the deployment
  
}, {
  timestamps: true
});

// Indexes
deploymentSchema.index({ uid: 1 });
deploymentSchema.index({ nodeId: 1 });
deploymentSchema.index({ status: 1 });
deploymentSchema.index({ deploymentDate: -1 });

// Auto-increment deploymentId
deploymentSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'deploymentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.deploymentId = `DEP-${String(counter.seq).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// Methods
deploymentSchema.methods.addLog = function(level, message) {
  this.logs.push({
    timestamp: new Date(),
    level,
    message
  });
  return this.save();
};

deploymentSchema.methods.updateStatus = function(status, message = '') {
  this.status = status;
  this.statusMessage = message;
  
  if (status === 'in-progress' && !this.startTime) {
    this.startTime = new Date();
  }
  
  if (['completed', 'failed', 'rolled-back'].includes(status)) {
    this.endTime = new Date();
    if (this.startTime) {
      this.deploymentDuration = Math.floor((this.endTime - this.startTime) / 1000);
    }
  }
  
  return this.save();
};

// Check if Deployment model already exists to prevent OverwriteModelError
const Deployment = mongoose.models.Deployment || 
  mongoose.model('Deployment', deploymentSchema);

export default Deployment;