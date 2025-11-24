import Insumo, { IInsumo } from '../models/Insumo.js';
import Produto from '../models/Produto.js';

interface InsumoData {
  nome: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  custoUnitario: number;
}

export const listarInsumos = async (userId: string): Promise<IInsumo[]> => {
  return Insumo.find({ userId }).sort({ nome: 1 });
};

export const buscarInsumoPorId = async (insumoId: string, userId: string): Promise<IInsumo> => {
  const insumo = await Insumo.findOne({ _id: insumoId, userId });
  
  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }
  
  return insumo;
};

export const criarInsumo = async (dadosInsumo: InsumoData, userId: string): Promise<IInsumo> => {
  return Insumo.create({
    ...dadosInsumo,
    userId
  });
};

export const atualizarInsumo = async (
  insumoId: string,
  dadosInsumo: Partial<InsumoData>,
  userId: string
): Promise<IInsumo> => {
  const insumo = await Insumo.findOneAndUpdate(
    { _id: insumoId, userId },
    dadosInsumo,
    { new: true, runValidators: true }
  );

  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }

  return insumo;
};

export const deletarInsumo = async (insumoId: string, userId: string): Promise<IInsumo> => {
  const produtosUsandoInsumo = await Produto.find({
    userId,
    'ingredientes.insumo': insumoId
  });

  if (produtosUsandoInsumo.length > 0) {
    const nomesProdutos = produtosUsandoInsumo.map(p => p.nome).join(', ');
    throw new Error(`Insumo não pode ser deletado. Está sendo usado nos produtos: ${nomesProdutos}`);
  }

  const insumo = await Insumo.findOneAndDelete({ _id: insumoId, userId });

  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }

  return insumo;
};
