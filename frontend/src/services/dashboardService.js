import api from './api.js';

export const obterEstatisticas = async () => {
  const response = await api.get('/dashboard/estatisticas');
  return response.data;
};
