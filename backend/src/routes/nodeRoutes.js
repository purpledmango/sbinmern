import express from 'express';
import {

  addNewNode,
  
  getAllNodes,
  getNodeById,
  testConnection,
  updateNode,
  
} from '../controllers/nodeControllers.js';
import {
  createNodeSchema,
  
  validate
} from '../validators/nodeValidators.js';

const router = express.Router();

// CRUD Routes with validation
router.post('/add', addNewNode);
router.get('/all', getAllNodes);
router.get('/:nid', getNodeById);
router.patch('/update/:nid', updateNode);
router.post('/test-connection', testConnection);
// router.get('/:id', validate(idParamSchema), getNode);
// router.put('/:id', validate(idParamSchema), validate(updateNodeSchema), updateNode);
// router.delete('/:id', validate(idParamSchema), deleteNode);

// Server Operations Routes with validation
// router.get('/:id/ssh-check', validate(checkSSHConnectionSchema), checkSSHConnection);
// router.get('/:id/metrics', validate(getServerMetricsSchema), getServerMetrics);

export default router;