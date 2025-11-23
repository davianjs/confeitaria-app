import * as ProdutoService from '../services/ProdutoService.js';

export const listar = async (req, res) => {
  try {
    const produtos = await ProdutoService.listarProdutos(req.userId);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const produto = await ProdutoService.buscarProdutoPorId(req.params.id, req.userId);
    res.json(produto);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const produto = await ProdutoService.criarProduto(req.body, req.userId);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const produto = await ProdutoService.atualizarProduto(req.params.id, req.body, req.userId);
    res.json(produto);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    await ProdutoService.deletarProduto(req.params.id, req.userId);
    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

export const calcularCusto = async (req, res) => {
  try {
    const custo = await ProdutoService.calcularCustoProdutoById(req.params.id, req.userId);
    res.json(custo);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
};
