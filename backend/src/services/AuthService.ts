import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

interface UserData {
  nome: string;
  nomeEstabelecimento: string;
  username: string;
  senha: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    nomeEstabelecimento: string;
    username: string;
  };
}

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password: string, hash: string): Promise<boolean> => 
  bcrypt.compare(password, hash);

const generateToken = (userId: string): string => 
  jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

export const registrar = async (userData: UserData): Promise<AuthResponse> => {
  const usuarioExistente = await User.findOne({ username: userData.username });
  
  if (usuarioExistente) {
    throw new Error('Username já está em uso');
  }

  const senhaHash = await hashPassword(userData.senha);
  
  const novoUsuario = await User.create({
    ...userData,
    senha: senhaHash
  });

  const token = generateToken(novoUsuario._id.toString());

  return {
    token,
    user: {
      id: novoUsuario._id.toString(),
      nome: novoUsuario.nome,
      nomeEstabelecimento: novoUsuario.nomeEstabelecimento,
      username: novoUsuario.username
    }
  };
};

export const login = async (username: string, senha: string): Promise<AuthResponse> => {
  const usuario = await User.findOne({ username });

  if (!usuario) {
    throw new Error('Credenciais inválidas');
  }

  const senhaValida = await comparePassword(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Credenciais inválidas');
  }

  const token = generateToken(usuario._id.toString());

  return {
    token,
    user: {
      id: usuario._id.toString(),
      nome: usuario.nome,
      nomeEstabelecimento: usuario.nomeEstabelecimento,
      username: usuario.username
    }
  };
};
