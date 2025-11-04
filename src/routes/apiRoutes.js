import express from 'express';
import apiKeyMiddleware from '../middleware/apiKey.middleware.js';
import notificanUserMiddleware from '../middleware/notificanUser.middleware.js';
import notificanRoutes from './notifican.route.js';
import messageRoutes from './message.route.js';
// import cors from '../services/cors.service.js';

const router = express.Router();

// router.use('/notifican', cors, apiKeyMiddleware, notificanUserMiddleware, notificanRoutes);
router.use('/notifican', apiKeyMiddleware, notificanUserMiddleware, notificanRoutes);
router.use('/', messageRoutes);

export default router;
