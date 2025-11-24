import { Response } from 'express';
import * as ProdutoService from '../services/ProdutoService.js';
import { AuthRequest } from '../middleware/auth.js';

export const listar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const produtos = await ProdutoService.listarProdutos(req.userId!);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: (error as Error).message });
  }
};

export const buscarPorId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const produto = await ProdutoService.buscarProdutoPorId(req.params.id, req.userId!);
    res.json(produto);
  } catch (error) {
    res.status(404).json({ erro: (error as Error).message });
  }
};

export const criar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const produto = await ProdutoService.criarProduto(req.body, req.userId!);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const atualizar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const produto = await ProdutoService.atualizarProduto(req.params.id, req.body, req.userId!);
    res.json(produto);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const deletar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await ProdutoService.deletarProduto(req.params.id, req.userId!);
    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const calcularCusto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const custo = await ProdutoService.calcularCustoProdutoById(req.params.id, req.userId!);
    res.json(custo);
  } catch (error) {
    res.status(404).json({ erro: (error as Error).message });
  }
};
