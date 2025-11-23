import api from './api.js';

export const registrar = async (userData) => {
  const response = await api.post('/auth/registrar', userData);
  return response.data;
};

export const login = async (username, senha) => {
  const response = await api.post('/auth/login', { username, senha });
  return response.data;
};

export const salvarAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
