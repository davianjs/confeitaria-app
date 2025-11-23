import Venda from '../models/Venda.js';
import Produto from '../models/Produto.js';
import Insumo from '../models/Insumo.js';

export const obterEstatisticas = async (userId) => {
  const vendas = await Venda.find({ userId });

  const totalVendas = vendas.length;
  const receitaTotal = vendas.reduce((acc, venda) => acc + venda.valorTotal, 0);
  const lucroTotal = vendas.reduce((acc, venda) => acc + venda.lucro, 0);
  const custoTotal = receitaTotal - lucroTotal;

  const totalProdutos = await Produto.countDocuments({ userId });
  const totalInsumos = await Insumo.countDocuments({ userId });

  const vendasPorProduto = vendas.reduce((acc, venda) => {
    const nomeProduto = venda.produtoSnapshot.nome;
    if (!acc[nomeProduto]) {
      acc[nomeProduto] = {
        nome: nomeProduto,
        quantidadeVendida: 0,
        receita: 0,
        lucro: 0
      };
    }
    acc[nomeProduto].quantidadeVendida += venda.quantidade;
    acc[nomeProduto].receita += venda.valorTotal;
    acc[nomeProduto].lucro += venda.lucro;
    return acc;
  }, {});

  const produtosMaisVendidos = Object.values(vendasPorProduto)
    .sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
    .slice(0, 5);

  const insumosComEstoqueBaixo = await Insumo.find({
    userId,
    quantidadeEstoque: { $lt: 10 }
  }).select('nome quantidadeEstoque unidadeMedida').limit(5);

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const vendasMesAtual = await Venda.find({
    userId,
    createdAt: { $gte: inicioMes }
  });

  const receitaMesAtual = vendasMesAtual.reduce((acc, venda) => acc + venda.valorTotal, 0);
  const lucroMesAtual = vendasMesAtual.reduce((acc, venda) => acc + venda.lucro, 0);

  return {
    resumo: {
      totalVendas,
      receitaTotal,
      custoTotal,
      lucroTotal,
      totalProdutos,
      totalInsumos
    },
    mesAtual: {
      vendas: vendasMesAtual.length,
      receita: receitaMesAtual,
      lucro: lucroMesAtual
    },
    produtosMaisVendidos,
    insumosComEstoqueBaixo
  };
};
