import express from 'express';
import {
  createNode,
  getNodes,
  getNode,
  updateNode,
  deleteNode,
  checkSSHConnection,
  getServerMetrics
} from '../controllers/nodeControllers.js';
import {
  createNodeSchema,
  updateNodeSchema,
  checkSSHConnectionSchema,
  getServerMetricsSchema,
  idParamSchema,
  validate
} from '../validators/nodeValidators.js';

const router = express.Router();

// CRUD Routes with validation
router.post('/', validate(createNodeSchema), createNode);
router.get('/', getNodes);
router.get('/:id', validate(idParamSchema), getNode);
router.put('/:id', validate(idParamSchema), validate(updateNodeSchema), updateNode);
router.delete('/:id', validate(idParamSchema), deleteNode);

// Server Operations Routes with validation
router.get('/:id/ssh-check', validate(checkSSHConnectionSchema), checkSSHConnection);
router.get('/:id/metrics', validate(getServerMetricsSchema), getServerMetrics);

export default router;