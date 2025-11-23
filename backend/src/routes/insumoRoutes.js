import express from 'express';
import * as insumoController from '../controllers/insumoController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', insumoController.listar);
router.get('/:id', insumoController.buscarPorId);
router.post('/', insumoController.criar);
router.put('/:id', insumoController.atualizar);
router.delete('/:id', insumoController.deletar);

export default router;
