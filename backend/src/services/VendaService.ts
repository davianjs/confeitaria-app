import Venda, { IVenda, IProdutoSnapshot, IIngredienteSnapshot } from '../models/Venda.js';
import Produto, { IProduto } from '../models/Produto.js';
import Insumo, { IInsumo } from '../models/Insumo.js';
import mongoose, { ClientSession } from 'mongoose';

interface IngredientePopulado {
  insumo: IInsumo;
  quantidade: number;
}

interface VerificacaoEstoque {
  disponivel: boolean;
  insumoId?: mongoose.Types.ObjectId;
  nomeInsumo: string;
  necessario: number;
  estoque: number;
}

interface FiltrosVenda {
  dataInicio?: string;
  dataFim?: string;
}

const verificarEstoqueDisponivel = async (
  ingredientes: IngredientePopulado[],
  quantidade: number,
  userId: string
): Promise<VerificacaoEstoque[]> => {
  const verificacoes = await Promise.all(
    ingredientes.map(async (ing) => {
      const insumo = await Insumo.findOne({ _id: ing.insumo._id, userId });
      
      if (!insumo) {
        return {
          disponivel: false,
          nomeInsumo: ing.insumo.nome,
          necessario: ing.quantidade * quantidade,
          estoque: 0
        };
      }

      const quantidadeNecessaria = ing.quantidade * quantidade;
      
      return {
        disponivel: insumo.quantidadeEstoque >= quantidadeNecessaria,
        insumoId: insumo._id,
        nomeInsumo: insumo.nome,
        necessario: quantidadeNecessaria,
        estoque: insumo.quantidadeEstoque
      };
    })
  );

  const insuficientes = verificacoes.filter(v => !v.disponivel);
  
  if (insuficientes.length > 0) {
    const mensagens = insuficientes.map(
      v => `${v.nomeInsumo}: necessário ${v.necessario}, disponível ${v.estoque}`
    );
    throw new Error(`Estoque insuficiente: ${mensagens.join('; ')}`);
  }

  return verificacoes;
};

const decrementarEstoque = async (
  ingredientes: VerificacaoEstoque[],
  quantidade: number,
  session: ClientSession
): Promise<void> => {
  const operacoes = ingredientes.map((ing) => ({
    updateOne: {
      filter: { _id: ing.insumoId },
      update: { $inc: { quantidadeEstoque: -(ing.necessario) } }
    }
  }));

  await Insumo.bulkWrite(operacoes, { session });
};

const criarSnapshot = (
  produto: IProduto,
  ingredientesPopulados: IngredientePopulado[]
): IProdutoSnapshot => {
  const ingredientesSnapshot: IIngredienteSnapshot[] = ingredientesPopulados.map(ing => ({
    nomeInsumo: ing.insumo.nome,
    quantidade: ing.quantidade,
    custoUnitario: ing.insumo.custoUnitario
  }));

  const custoTotal = ingredientesSnapshot.reduce(
    (total, ing) => total + (ing.custoUnitario * ing.quantidade),
    0
  );

  return {
    nome: produto.nome,
    custoTotal,
    precoVenda: produto.precoVenda,
    ingredientes: ingredientesSnapshot
  };
};

export const registrarVenda = async (
  produtoId: string,
  quantidade: number,
  userId: string
): Promise<IVenda> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const produto = await Produto.findOne({ _id: produtoId, userId })
      .populate('ingredientes.insumo')
      .session(session);

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const ingredientesPopulados = produto.ingredientes as unknown as IngredientePopulado[];

    const verificacoes = await verificarEstoqueDisponivel(
      ingredientesPopulados,
      quantidade,
      userId
    );

    await decrementarEstoque(verificacoes, quantidade, session);

    const snapshot = criarSnapshot(produto, ingredientesPopulados);
    const valorTotal = snapshot.precoVenda * quantidade;
    const custoTotalVenda = snapshot.custoTotal * quantidade;
    const lucro = valorTotal - custoTotalVenda;

    const venda = await Venda.create([{
      produtoSnapshot: snapshot,
      quantidade,
      valorTotal,
      lucro,
      userId
    }], { session });

    await session.commitTransaction();

    return venda[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const listarVendas = async (userId: string, filtros: FiltrosVenda = {}): Promise<IVenda[]> => {
  const query: any = { userId };

  if (filtros.dataInicio || filtros.dataFim) {
    query.createdAt = {};
    if (filtros.dataInicio) {
      query.createdAt.$gte = new Date(filtros.dataInicio);
    }
    if (filtros.dataFim) {
      query.createdAt.$lte = new Date(filtros.dataFim);
    }
  }

  return Venda.find(query).sort({ createdAt: -1 });
};

export const buscarVendaPorId = async (vendaId: string, userId: string): Promise<IVenda> => {
  const venda = await Venda.findOne({ _id: vendaId, userId });
  
  if (!venda) {
    throw new Error('Venda não encontrada');
  }
  
  return venda;
};
