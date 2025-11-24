import api from './api';

export interface ProdutoMaisVendido {
  nome: string;
  quantidadeVendida: number;
  receita: number;
  lucro: number;
}

export interface InsumoEstoqueBaixo {
  nome: string;
  quantidadeEstoque: number;
  unidadeMedida: string;
}

export interface Estatisticas {
  resumo: {
    totalVendas: number;
    receitaTotal: number;
    custoTotal: number;
    lucroTotal: number;
    totalProdutos: number;
    totalInsumos: number;
  };
  mesAtual: {
    vendas: number;
    receita: number;
    lucro: number;
  };
  produtosMaisVendidos: ProdutoMaisVendido[];
  insumosComEstoqueBaixo: InsumoEstoqueBaixo[];
}

export const obterEstatisticas = async (): Promise<Estatisticas> => {
  const response = await api.get<Estatisticas>('/dashboard/estatisticas');
  return response.data;
};
