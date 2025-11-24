import { Response } from 'express';
import * as VendaService from '../services/VendaService.js';
import { AuthRequest } from '../middleware/auth.js';

export const registrarVenda = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { produtoId, quantidade } = req.body;
    const venda = await VendaService.registrarVenda(produtoId, quantidade, req.userId!);
    res.status(201).json(venda);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filtros = {
      dataInicio: req.query.dataInicio as string,
      dataFim: req.query.dataFim as string
    };
    const vendas = await VendaService.listarVendas(req.userId!, filtros);
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
};

export const buscarPorId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const venda = await VendaService.buscarVendaPorId(req.params.id, req.userId!);
    res.json(venda);
  } catch (error) {
    res.status(404).json({ erro: (error as Error).message });
  }
};
