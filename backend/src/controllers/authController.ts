import { Request, Response } from 'express';
import * as AuthService from '../services/AuthService.js';

export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const resultado = await AuthService.registrar(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ erro: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, senha } = req.body;
    const resultado = await AuthService.login(username, senha);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({ erro: (error as Error).message });
  }
};
