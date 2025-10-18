import express from 'express';
import notificanController from '../controllers/notifican.controller.js';

const router = express.Router();

router.get('/initial', notificanController.initial);

export default router;
