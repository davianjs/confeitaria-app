import express from 'express';
import * as produtoController from '../controllers/produtoController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.get('/:id/custo', produtoController.calcularCusto);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);

export default router;
