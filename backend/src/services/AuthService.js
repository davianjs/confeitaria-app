import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const generateToken = (userId) => jwt.sign(
  { userId },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

export const registrar = async (userData) => {
  const usuarioExistente = await User.findOne({ username: userData.username });
  
  if (usuarioExistente) {
    throw new Error('Username já está em uso');
  }

  const senhaHash = await hashPassword(userData.senha);
  
  const novoUsuario = await User.create({
    ...userData,
    senha: senhaHash
  });

  const token = generateToken(novoUsuario._id);

  return {
    token,
    user: {
      id: novoUsuario._id,
      nome: novoUsuario.nome,
      nomeEstabelecimento: novoUsuario.nomeEstabelecimento,
      username: novoUsuario.username
    }
  };
};

export const login = async (username, senha) => {
  const usuario = await User.findOne({ username });

  if (!usuario) {
    throw new Error('Credenciais inválidas');
  }

  const senhaValida = await comparePassword(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Credenciais inválidas');
  }

  const token = generateToken(usuario._id);

  return {
    token,
    user: {
      id: usuario._id,
      nome: usuario.nome,
      nomeEstabelecimento: usuario.nomeEstabelecimento,
      username: usuario.username
    }
  };
};
