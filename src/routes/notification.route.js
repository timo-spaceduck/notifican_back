import express from 'express';
import notificationsController from '../controllers/notifications.controller.js';

const router = express.Router();

router.post('/', notificationsController.saveToken);

export default router;
