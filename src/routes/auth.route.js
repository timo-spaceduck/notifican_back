import express from 'express';
import passport from "passport"
import googleController from '../controllers/auth/google.controller.js';

const router = express.Router();

router.get('/google', googleController.auth);
router.get('/google/callback', passport.authenticate("google", { session: false }), googleController.authCallback);

export default router;
