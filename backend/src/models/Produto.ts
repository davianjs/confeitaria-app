import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IIngrediente {
  insumo: Types.ObjectId;
  quantidade: number;
}

export interface IProduto extends Document {
  nome: string;
  descricao?: string;
  precoVenda: number;
  ingredientes: IIngrediente[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const produtoSchema = new Schema<IProduto>(
  {
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
        type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProduto>('Produto', produtoSchema);
