import express from 'express';
import notificanController from '../controllers/notifican.controller.js';

const router = express.Router();

router.get('/initial', notificanController.initial);
router.get('/messages', notificanController.getMessages);

// Categories CRUD endpoints
router.get('/categories', notificanController.getCategories);
router.get('/categories/:id', notificanController.getCategory);
router.post('/categories', notificanController.createCategory);
router.put('/categories/:id', notificanController.updateCategory);
router.delete('/categories/:id', notificanController.deleteCategory);

router.delete('/message/:id', notificanController.deleteMessage);

router.post('/token', notificanController.saveToken);

export default router;
