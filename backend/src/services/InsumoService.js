import Insumo from '../models/Insumo.js';
import Produto from '../models/Produto.js';

export const listarInsumos = async (userId) => {
  return Insumo.find({ userId }).sort({ nome: 1 });
};

export const buscarInsumoPorId = async (insumoId, userId) => {
  const insumo = await Insumo.findOne({ _id: insumoId, userId });
  
  if (!insumo) {
    throw new Error('Insumo não encontrado');
  }
  
  return insumo;
};

export const criarInsumo = async (dadosInsumo, userId) => {
  return Insumo.create({
    ...dadosInsumo,
    userId
  });
};

export const atualizarInsumo = async (insumoId, dadosInsumo, userId) => {
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

export const deletarInsumo = async (insumoId, userId) => {
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
