import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  precoVenda: {
    type: Number,
    required: true,
    min: 0
  },
  ingredientes: [{
    insumo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Insumo',
      required: true
    },
    quantidade: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Produto', produtoSchema);
