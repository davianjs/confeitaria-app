import mongoose from 'mongoose';

const insumoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  unidadeMedida: {
    type: String,
    required: true
  },
  quantidadeEstoque: {
    type: Number,
    required: true,
    min: 0
  },
  custoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Insumo', insumoSchema);
