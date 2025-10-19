import express from 'express';
import notificanController from '../controllers/notifican.controller.js';

const router = express.Router();

router.get('/initial', notificanController.initial);

// Categories CRUD endpoints
router.get('/categories', notificanController.getCategories);
router.get('/categories/:id', notificanController.getCategory);
router.post('/categories', notificanController.createCategory);
router.put('/categories/:id', notificanController.updateCategory);
router.delete('/categories/:id', notificanController.deleteCategory);

router.post('/token', notificanController.saveToken);
router.post('/', notificanController.log);

export default router;
