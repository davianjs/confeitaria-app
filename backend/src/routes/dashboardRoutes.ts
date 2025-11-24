import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/estatisticas', dashboardController.obterEstatisticas);

export default router;
