import api from './api.js';

export const registrarVenda = async (produtoId, quantidade) => {
  const response = await api.post('/vendas', { produtoId, quantidade });
  return response.data;
};

export const listarVendas = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
  
  const response = await api.get(`/vendas?${params.toString()}`);
  return response.data;
};

export const buscarVenda = async (id) => {
  const response = await api.get(`/vendas/${id}`);
  return response.data;
};
