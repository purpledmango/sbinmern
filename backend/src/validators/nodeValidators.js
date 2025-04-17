import Joi from 'joi';

// Base node schema for both creation and update
const baseNodeSchema = Joi.object({
  host: Joi.string()
    .required()
    .hostname()
    .messages({
      'string.hostname': 'Host must be a valid hostname or IP address',
      'any.required': 'Host is required'
    }),
  port: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(22),
  username: Joi.string()
    .required()
    .min(3)
    .max(32)
    .pattern(/^[a-z_][a-z0-9_-]*$/)
    .messages({
      'string.pattern.base': 'Username must start with a letter or underscore and contain only letters, numbers, hyphens, or underscores',
      'any.required': 'Username is required'
    }),
  encryptedPassword: Joi.string()
    .allow('')
    .optional(),
  encryptedPrivateKey: Joi.string()
    .allow('')
    .optional(),
  sshKeyName: Joi.string()
    .trim()
    .max(64)
    .optional()
}).options({ abortEarly: false });

// Schema for creating a new node
export const createNodeSchema = baseNodeSchema;

// Schema for updating a node
export const updateNodeSchema = baseNodeSchema.keys({
  host: Joi.string()
    .hostname()
    .optional(),
  port: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .optional(),
  username: Joi.string()
    .min(3)
    .max(32)
    .pattern(/^[a-z_][a-z0-9_-]*$/)
    .optional()
});

// Schema for checking SSH connection
export const checkSSHConnectionSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'ID must be a valid hexadecimal value',
      'string.length': 'ID must be 24 characters long'
    })
});

// Schema for getting server metrics
export const getServerMetricsSchema = Joi.object({
  id: Joi.alternatives()
    .try(
      Joi.string().hex().length(24),
      Joi.string().valid('local')
    )
    .required()
});

// Schema for ID parameter validation
export const idParamSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
});

// Validation middleware
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.params);
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
  next();
};