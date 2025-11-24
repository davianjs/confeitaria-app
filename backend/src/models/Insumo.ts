import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInsumo extends Document {
  nome: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  custoUnitario: number;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const insumoSchema = new Schema<IInsumo>({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IInsumo>('Insumo', insumoSchema);
