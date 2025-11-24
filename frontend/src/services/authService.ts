import api from './api';

export interface User {
  id: string;
  nome: string;
  nomeEstabelecimento: string;
  username: string;
}

export interface UserData {
  nome: string;
  nomeEstabelecimento: string;
  username: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const registrar = async (userData: UserData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/registrar', userData);
  return response.data;
};

export const login = async (username: string, senha: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, senha });
  return response.data;
};

export const salvarAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
