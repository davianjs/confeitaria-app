import { Response } from 'express';
import * as InsumoService from '../services/InsumoService.js';
import { AuthRequest } from '../middleware/auth.js';

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const insumos = await InsumoService.listarInsumos(req.userId!);
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
};

export const buscarPorId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const insumo = await InsumoService.buscarInsumoPorId(req.params.id, req.userId!);
    res.json(insumo);
  } catch (error) {
    res.status(404).json({ erro: (error as Error).message });
  }
};

export const criar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const insumo = await InsumoService.criarInsumo(req.body, req.userId!);
    res.status(201).json(insumo);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const atualizar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const insumo = await InsumoService.atualizarInsumo(req.params.id, req.body, req.userId!);
    res.json(insumo);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const deletar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await InsumoService.deletarInsumo(req.params.id, req.userId!);
    res.json({ mensagem: 'Insumo deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};
