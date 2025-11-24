import api from './api';

export interface Insumo {
  _id: string;
  nome: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  custoUnitario: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsumoInput {
  nome: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  custoUnitario: number;
}

export const listarInsumos = async (): Promise<Insumo[]> => {
  const response = await api.get<Insumo[]>('/insumos');
  return response.data;
};

export const buscarInsumo = async (id: string): Promise<Insumo> => {
  const response = await api.get<Insumo>(`/insumos/${id}`);
  return response.data;
};

export const criarInsumo = async (insumo: InsumoInput): Promise<Insumo> => {
  const response = await api.post<Insumo>('/insumos', insumo);
  return response.data;
};

export const atualizarInsumo = async (id: string, insumo: Partial<InsumoInput>): Promise<Insumo> => {
  const response = await api.put<Insumo>(`/insumos/${id}`, insumo);
  return response.data;
};

export const deletarInsumo = async (id: string): Promise<{ mensagem: string }> => {
  const response = await api.delete<{ mensagem: string }>(`/insumos/${id}`);
  return response.data;
};
