import express from 'express';
import * as vendaController from '../controllers/vendaController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/', vendaController.registrarVenda);
router.get('/', vendaController.listar);
router.get('/:id', vendaController.buscarPorId);

export default router;
