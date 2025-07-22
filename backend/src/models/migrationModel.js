import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const migrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    migrationId: {
        type: String,
        default: () => uuid().slice(0, 8),
        required: true,
        unique: true,
        index: true
    },
    uid: {
        type: String,
        required: true,
    },
    wp_archive: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /\.(zip)$/i.test(v);
            },
            message: props => `${props.value} is not a valid ZIP archive filename!`
        }
    },
    sql_dump: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /\.(sql|sql\.gz|zip)$/i.test(v);
            },
            message: props => `${props.value} is not a valid SQL dump filename!`
        }
    },
    migrationCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    deploymentId: {
        type: String,
        required: false,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    error: {
        type: String,
        default: null
    },
    fileSize: {
        wp_archive: Number,
        sql_dump: Number
    },
    checksums: {
        wp_archive: String,
        sql_dump: String
    },
    migrationStack: {
        type: String,
        enum: ['wordpress', 'magento'],
        required: true,
        default: 'wordpress'
    }
}, {
    timestamps: true,  // Moved to schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for migration duration
migrationSchema.virtual('duration').get(function() {
    if (this.completedAt && this.createdAt) {
        return this.completedAt - this.createdAt;
    }
    return null;
});

// Indexes for common query patterns
migrationSchema.index({ uid: 1, migrationCompleted: 1 });
migrationSchema.index({ deploymentId: 1, status: 1 });

// Pre-save hook to update timestamps
migrationSchema.pre('save', function(next) {
    if (this.isModified('migrationCompleted') && this.migrationCompleted) {
        this.completedAt = new Date();
        this.status = 'completed';
    }
    next();
});

const Migration = mongoose.model('Migration', migrationSchema);

export default Migration;