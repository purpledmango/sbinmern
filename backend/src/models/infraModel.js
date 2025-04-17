import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create a counter model for auto-increment
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

// Server credentials schema (stored encrypted)
const NodeSchema = new Schema({
  nodeId: {
    type: Number,
    unique: true
  },
  host: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic hostname or IP validation
        return /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$|^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(v);
      },
      message: props => `${props.value} is not a valid hostname or IP address!`
    }
  },
  port: {
    type: Number,
    default: 22,
    min: 1,
    max: 65535
  },
  username: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Unix username validation (3-32 chars, no special chars except _ and -)
        return /^[a-z_][a-z0-9_-]{2,31}$/.test(v);
      },
      message: props => `${props.value} is not a valid username! Must start with letter or underscore, 3-32 characters, and only contain letters, numbers, hyphens or underscores.`
    }
  },
  encryptedPassword: {
    type: String,
    // select: false // Never return this field by default
  },
  encryptedPrivateKey: {
    type: String,
    select: false // Never return this field by default
  },
  sshKeyName: {
    type: String,
    trim: true,
    maxlength: 64
  }
});

// Auto-increment plugin replacement
NodeSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'nodeId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.nodeId = counter.seq;
    next();
  } catch (err) {
    next(err);
  }
});

// Add instance method to test SSH connection
NodeSchema.methods.testConnection = async function() {
  const { exec } = await import('child_process');
  const util = await import('util');
  const execPromise = util.promisify(exec);
  
  try {
    const cmd = `ssh -p ${this.port} ${this.username}@${this.host} echo "Connection successful"`;
    const { stdout } = await execPromise(cmd, { timeout: 5000 });
    return { success: true, message: stdout.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const NodeModel = mongoose.model("Node", NodeSchema);
export default NodeModel;