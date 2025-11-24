import api from './api';

export interface IngredienteSnapshot {
  nomeInsumo: string;
  quantidade: number;
  custoUnitario: number;
}

export interface ProdutoSnapshot {
  nome: string;
  custoTotal: number;
  precoVenda: number;
  ingredientes: IngredienteSnapshot[];
}

export interface Venda {
  _id: string;
  produtoSnapshot: ProdutoSnapshot;
  quantidade: number;
  valorTotal: number;
  lucro: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendaInput {
  produtoId: string;
  quantidade: number;
}

export interface FiltrosVenda {
  dataInicio?: string;
  dataFim?: string;
}

export const registrarVenda = async (produtoId: string, quantidade: number): Promise<Venda> => {
  const response = await api.post<Venda>('/vendas', { produtoId, quantidade });
  return response.data;
};

export const listarVendas = async (filtros: FiltrosVenda = {}): Promise<Venda[]> => {
  const params = new URLSearchParams();
  if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
  
  const response = await api.get<Venda[]>(`/vendas?${params.toString()}`);
  return response.data;
};

export const buscarVenda = async (id: string): Promise<Venda> => {
  const response = await api.get<Venda>(`/vendas/${id}`);
  return response.data;
};
