import mongoose from 'mongoose';
import { UserModel } from '../tsModels/userModel';

const Schema = mongoose.Schema;

// Define el esquema usando el tipo `userModel`
const UserSchema = new Schema<UserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Define el modelo y expórtalo
const UserModel = mongoose.model<UserModel>('users', UserSchema);

export default UserModel;
