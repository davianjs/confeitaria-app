import api from './api';
import { Insumo } from './insumoService';

export interface Ingrediente {
  insumo: string | Insumo;
  quantidade: number;
}

export interface Produto {
  _id: string;
  nome: string;
  descricao?: string;
  precoVenda: number;
  ingredientes: Ingrediente[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProdutoInput {
  nome: string;
  descricao?: string;
  precoVenda: number;
  ingredientes: Ingrediente[];
}

export interface CustoProduto {
  custoTotal: number;
  precoVenda: number;
  lucro: number;
}

export const listarProdutos = async (): Promise<Produto[]> => {
  const response = await api.get<Produto[]>('/produtos');
  return response.data;
};

export const buscarProduto = async (id: string): Promise<Produto> => {
  const response = await api.get<Produto>(`/produtos/${id}`);
  return response.data;
};

export const criarProduto = async (produto: ProdutoInput): Promise<Produto> => {
  const response = await api.post<Produto>('/produtos', produto);
  return response.data;
};

export const atualizarProduto = async (id: string, produto: Partial<ProdutoInput>): Promise<Produto> => {
  const response = await api.put<Produto>(`/produtos/${id}`, produto);
  return response.data;
};

export const deletarProduto = async (id: string): Promise<{ mensagem: string }> => {
  const response = await api.delete<{ mensagem: string }>(`/produtos/${id}`);
  return response.data;
};

export const calcularCusto = async (id: string): Promise<CustoProduto> => {
  const response = await api.get<CustoProduto>(`/produtos/${id}/custo`);
  return response.data;
};
