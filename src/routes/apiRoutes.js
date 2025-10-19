import express from 'express';
import apiKeyMiddleware from '../middleware/apiKey.middleware.js';
import notificanUserMiddleware from '../middleware/notificanUser.middleware.js';
import paddleRoutes from './paddle.route.js';
import notificanRoutes from './notifican.route.js';
import userRoutes from './user.route.js';
import  { isAuthenticated } from "../middleware/authenticated.middleware.js"

const router = express.Router();

router.use('/user', express.json(), apiKeyMiddleware, userRoutes);
router.use('/paddle', paddleRoutes);
router.use('/notifican', apiKeyMiddleware, notificanUserMiddleware, notificanRoutes);

export default router;
