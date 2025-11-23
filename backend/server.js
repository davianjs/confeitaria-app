import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import insumoRoutes from './src/routes/insumoRoutes.js';
import produtoRoutes from './src/routes/produtoRoutes.js';
import vendaRoutes from './src/routes/vendaRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
