import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserModel extends Document {
    name: string;
    email: string;
    password: string;
    date: Date;
}

const UserSchema: Schema<UserModel> = new Schema({
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

const User: Model<UserModel> = mongoose.model<UserModel>('User', UserSchema);

export default User;
