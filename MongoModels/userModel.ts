import mongoose, { Document } from 'mongoose';
import { UserModel } from '../tsModels/userModel';
const Schema = mongoose.Schema;

// Define the TypeScript interface for the User model
interface IUser extends Document, UserModel {}

// Create Schema
const UserSchema = new Schema<IUser>({
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

// Export the Mongoose model
export default mongoose.model<IUser>('users', UserSchema);
