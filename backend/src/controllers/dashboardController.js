import * as DashboardService from '../services/DashboardService.js';

export const obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await DashboardService.obterEstatisticas(req.userId);
    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
