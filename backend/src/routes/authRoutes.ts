import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

export default router;
