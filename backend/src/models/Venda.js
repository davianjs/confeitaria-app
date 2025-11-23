import mongoose from 'mongoose';

const vendaSchema = new mongoose.Schema({
  produtoSnapshot: {
    nome: {
      type: String,
      required: true
    },
    custoTotal: {
      type: Number,
      required: true
    },
    precoVenda: {
      type: Number,
      required: true
    },
    ingredientes: [{
      nomeInsumo: String,
      quantidade: Number,
      custoUnitario: Number
    }]
  },
  quantidade: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  valorTotal: {
    type: Number,
    required: true
  },
  lucro: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Venda', vendaSchema);
