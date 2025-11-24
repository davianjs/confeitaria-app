import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IIngredienteSnapshot {
  nomeInsumo: string;
  quantidade: number;
  custoUnitario: number;
}

export interface IProdutoSnapshot {
  nome: string;
  custoTotal: number;
  precoVenda: number;
  ingredientes: IIngredienteSnapshot[];
}

export interface IVenda extends Document {
  produtoSnapshot: IProdutoSnapshot;
  quantidade: number;
  valorTotal: number;
  lucro: number;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vendaSchema = new Schema<IVenda>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IVenda>('Venda', vendaSchema);
