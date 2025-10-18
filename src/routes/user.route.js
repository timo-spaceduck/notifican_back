import express from 'express';
import userController from "../controllers/user.controller.js"

const router = express.Router();

router.get('/', userController.getUser);
router.post('/logout', userController.logout);

export default router;
