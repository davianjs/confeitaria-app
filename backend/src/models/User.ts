import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  nome: string;
  nomeEstabelecimento: string;
  username: string;
  senha: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  nome: {
    type: String,
    required: true
  },
  nomeEstabelecimento: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
