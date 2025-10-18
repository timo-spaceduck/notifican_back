import express from 'express';
import paddleController from '../controllers/paddle.controller.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), paddleController.handleWebhook);

export default router;
