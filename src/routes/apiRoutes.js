import express from 'express';
import apiKeyMiddleware from '../middleware/apiKey.middleware.js';
import statisticsRoutes from './statistics.route.js';
import feedbackRoutes from './feedback.route.js';
import promocodeRoutes from './promocode.route.js';
import notificationsRoutes from './notification.route.js';
import pdfRoutes from './pdfs.route.js';
import paddleRoutes from './paddle.route.js';
import notificanRoutes from './notifican.route.js';
import userRoutes from './user.route.js';
import todoRoutes from './todo.route.js';
import  { isAuthenticated } from "../middleware/authenticated.middleware.js"

const router = express.Router();

router.use('/stats', express.json(), apiKeyMiddleware, statisticsRoutes);
router.use('/feedback', express.json(), apiKeyMiddleware, feedbackRoutes);
router.use('/promocode', express.json(), apiKeyMiddleware, promocodeRoutes);
router.use('/notifications', express.json(), apiKeyMiddleware, notificationsRoutes);
router.use('/user', express.json(), apiKeyMiddleware, userRoutes);
router.use('/pdf', express.raw({ type: "application/pdf", limit: "10mb" }), apiKeyMiddleware, pdfRoutes);
router.use('/paddle', paddleRoutes);
router.use('/notifican', notificanRoutes);

router.use('/todo', express.json(), apiKeyMiddleware, isAuthenticated, todoRoutes);

export default router;
