import Produto, { IProduto, IIngrediente } from '../models/Produto.js';
import Insumo, { IInsumo } from '../models/Insumo.js';

interface ProdutoData {
  nome: string;
  descricao?: string;
  precoVenda: number;
  ingredientes: IIngrediente[];
}

interface CustoProduto {
  custoTotal: number;
  precoVenda: number;
  lucro: number;
}

interface IngredientePopulado extends Omit<IIngrediente, 'insumo'> {
  insumo: IInsumo;
}

interface ProdutoPopulado extends Omit<IProduto, 'ingredientes'> {
  ingredientes: IngredientePopulado[];
}

export const listarProdutos = async (userId: string): Promise<IProduto[]> => {
  return Produto.find({ userId })
    .populate('ingredientes.insumo')
    .sort({ nome: 1 });
};

export const buscarProdutoPorId = async (produtoId: string, userId: string): Promise<IProduto> => {
  const produto = await Produto.findOne({ _id: produtoId, userId })
    .populate('ingredientes.insumo');
  
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
  
  return produto;
};

const calcularCustoProduto = (ingredientes: IngredientePopulado[]): number => {
  return ingredientes.reduce((total, ing) => {
    const custoIngrediente = ing.insumo.custoUnitario * ing.quantidade;
    return total + custoIngrediente;
  }, 0);
};

export const criarProduto = async (dadosProduto: ProdutoData, userId: string): Promise<IProduto> => {
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

export const atualizarProduto = async (
  produtoId: string,
  dadosProduto: Partial<ProdutoData>,
  userId: string
): Promise<IProduto> => {
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

export const deletarProduto = async (produtoId: string, userId: string): Promise<IProduto> => {
  const produto = await Produto.findOneAndDelete({ _id: produtoId, userId });

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  return produto;
};

export const calcularCustoProdutoById = async (
  produtoId: string,
  userId: string
): Promise<CustoProduto> => {
  const produto = await buscarProdutoPorId(produtoId, userId) as unknown as ProdutoPopulado;
  const custoTotal = calcularCustoProduto(produto.ingredientes);
  
  return {
    custoTotal,
    precoVenda: produto.precoVenda,
    lucro: produto.precoVenda - custoTotal
  };
};
