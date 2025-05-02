import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const CredentialsSchema = new Schema({
  host: {
    type: String,
    required: true,
    trim: true
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
    trim: true
  },
  password: {
    type: String,
    select: false,
    set: function(password) {  // Removed async here since we're not awaiting
      if (!password) return undefined;
      const salt = bcrypt.genSaltSync(12);
      return bcrypt.hashSync(password, salt);
    }
  },
  privateKey: {
    type: String,
    select: false,
    trim: true
  },
  passphrase: {
    type: String,
    select: false,
    set: function(passphrase) {  // Removed async here
      if (!passphrase) return undefined;
      const salt = bcrypt.genSaltSync(12);
      return bcrypt.hashSync(passphrase, salt);
    }
  }
}, { _id: false });

const SshStatusSchema = new Schema({
  connected: {
    type: Boolean,
    required: true,
    default: false  // Added default value
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  authMethod: {
    type: String,
    enum: ['password', 'privateKey', 'none'],
    required: true,
    default: 'none'  // Added default value
  },
  error: {
    type: String,
    default: null
  }
}, { _id: false });

const NodeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  nid: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4().split('-')[0], // Takes first 8 chars (first segment)
    validate: {
      validator: function(v) {
        // Validate it's 8 hex characters
        return /^[0-9a-f]{8}$/i.test(v);
      },
      message: props => `${props.value} is not a valid 8-character hex ID!`
    }
  },
  description: {
    type: String,
    trim: true
  },
  credentials: {
    type: CredentialsSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  sshStatus: {
    type: SshStatusSchema,
    required: true,
    default: () => ({
      connected: false,
      lastChecked: new Date(),
      authMethod: 'none',
      error: null
    })
  },
  lastConnection: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.credentials.password;
      delete ret.credentials.privateKey;
      delete ret.credentials.passphrase;
      return ret;
    }
  }
});

NodeSchema.methods.verifyCredentials = async function(password) {
  if (this.credentials.password) {
    return await bcrypt.compare(password, this.credentials.password);
  }
  return false;
};

NodeSchema.pre('save', async function(next) {
  if (this.isModified('credentials') || !this.sshStatus.connected) {
    try {
      const node = await this.model('Node')
        .findById(this._id)
        .select('+credentials.password +credentials.privateKey +credentials.passphrase');
      
      const creds = node ? node.credentials : this.credentials;
      const sshCheck = await this.model('Node').verifySSHConnection(creds);
      
      this.sshStatus = {
        connected: sshCheck.success,
        lastChecked: new Date(),
        authMethod: sshCheck.authMethod || 'none',
        error: sshCheck.error || null
      };
      
      this.status = sshCheck.success ? 'active' : 'inactive';
      this.lastConnection = sshCheck.success ? new Date() : null;
    } catch (error) {
      this.sshStatus = {
        connected: false,
        lastChecked: new Date(),
        authMethod: 'none',
        error: error.message
      };
      this.status = 'inactive';
    }
  }
  next();
});

NodeSchema.statics.verifySSHConnection = async function(credentials) {
  const ssh = new (require('node-ssh'))();
  
  const connectionOptions = {
    host: credentials.host,
    port: credentials.port || 22,
    username: credentials.username,
    readyTimeout: 8000,
    connectTimeout: 8000
  };

  try {
    if (credentials.privateKey) {
      connectionOptions.privateKey = credentials.privateKey;
      if (credentials.passphrase) {
        connectionOptions.passphrase = credentials.passphrase;
      }
    } else if (credentials.password) {
      connectionOptions.password = credentials.password;
    } else {
      return { success: false, authMethod: 'none', error: 'No authentication method' };
    }

    await ssh.connect(connectionOptions);
    const result = await ssh.execCommand('echo "Connection test"');
    
    if (result.code !== 0) throw new Error(result.stderr);
    
    return { 
      success: true,
      authMethod: credentials.privateKey ? 'privateKey' : 'password' 
    };
  } catch (error) {
    return { 
      success: false,
      authMethod: credentials.privateKey ? 'privateKey' : 'password',
      error: error.message 
    };
  } finally {
    if (ssh.isConnected()) ssh.dispose();
  }
};

const NodeModel = mongoose.model('Node', NodeSchema);

export default NodeModel;