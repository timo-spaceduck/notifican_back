import express from 'express';
import messageController from '../controllers/message.controller.js';

const router = express.Router();

router.post('/:uuid', messageController.send);
router.get('/stats', messageController.stats);

export default router;
