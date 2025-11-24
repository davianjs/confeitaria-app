import { Response } from 'express';
import * as DashboardService from '../services/DashboardService.js';
import { AuthRequest } from '../middleware/auth.js';

export const obterEstatisticas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const estatisticas = await DashboardService.obterEstatisticas(req.userId!);
    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
};
