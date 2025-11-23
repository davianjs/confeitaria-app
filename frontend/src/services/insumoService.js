import api from './api.js';

export const listarInsumos = async () => {
  const response = await api.get('/insumos');
  return response.data;
};

export const buscarInsumo = async (id) => {
  const response = await api.get(`/insumos/${id}`);
  return response.data;
};

export const criarInsumo = async (insumo) => {
  const response = await api.post('/insumos', insumo);
  return response.data;
};

export const atualizarInsumo = async (id, insumo) => {
  const response = await api.put(`/insumos/${id}`, insumo);
  return response.data;
};

export const deletarInsumo = async (id) => {
  const response = await api.delete(`/insumos/${id}`);
  return response.data;
};
