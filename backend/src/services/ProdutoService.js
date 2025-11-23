import Produto from '../models/Produto.js';
import Insumo from '../models/Insumo.js';

export const listarProdutos = async (userId) => {
  return Produto.find({ userId })
    .populate('ingredientes.insumo')
    .sort({ nome: 1 });
};

export const buscarProdutoPorId = async (produtoId, userId) => {
  const produto = await Produto.findOne({ _id: produtoId, userId })
    .populate('ingredientes.insumo');
  
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
  
  return produto;
};

const calcularCustoProduto = (ingredientes) => {
  return ingredientes.reduce((total, ing) => {
    const custoIngrediente = ing.insumo.custoUnitario * ing.quantidade;
    return total + custoIngrediente;
  }, 0);
};

export const criarProduto = async (dadosProduto, userId) => {
  const insumosIds = dadosProduto.ingredientes.map(ing => ing.insumo);
  const insumosExistem = await Insumo.find({
    _id: { $in: insumosIds },
    userId
  });

  if (insumosExistem.length !== insumosIds.length) {
    throw new Error('Um ou mais insumos não foram encontrados');
  }

  return Produto.create({
    ...dadosProduto,
    userId
  });
};

export const atualizarProduto = async (produtoId, dadosProduto, userId) => {
  if (dadosProduto.ingredientes) {
    const insumosIds = dadosProduto.ingredientes.map(ing => ing.insumo);
    const insumosExistem = await Insumo.find({
      _id: { $in: insumosIds },
      userId
    });

    if (insumosExistem.length !== insumosIds.length) {
      throw new Error('Um ou mais insumos não foram encontrados');
    }
  }

  const produto = await Produto.findOneAndUpdate(
    { _id: produtoId, userId },
    dadosProduto,
    { new: true, runValidators: true }
  ).populate('ingredientes.insumo');

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  return produto;
};

export const deletarProduto = async (produtoId, userId) => {
  const produto = await Produto.findOneAndDelete({ _id: produtoId, userId });

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  return produto;
};

export const calcularCustoProdutoById = async (produtoId, userId) => {
  const produto = await buscarProdutoPorId(produtoId, userId);
  const custoTotal = calcularCustoProduto(produto.ingredientes);
  
  return {
    custoTotal,
    precoVenda: produto.precoVenda,
    lucro: produto.precoVenda - custoTotal
  };
};
