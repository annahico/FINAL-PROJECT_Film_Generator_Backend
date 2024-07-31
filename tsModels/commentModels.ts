import mongoose, { Document, Schema } from 'mongoose';

// Definir la interfaz userComment
export interface IUserComment {
  user: {
    userID: string;
    userName: string;
  };
  commentText: string;
  commentUpvotes: number;
  commentDownvotes: number;
  commentTimeStamp: string;
  parent: null | string[];
  commentReplies: IUserComment[];
}

// Definir la interfaz comment
export interface IComment extends Document {
  movieId: string;
  movieImageURI: string;
  comments: IUserComment[];
}

// Esquema para userComment
const UserCommentSchema: Schema<IUserComment> = new Schema({
  user: {
    userID: { type: String, required: true },
    userName: { type: String, required: true },
  },
  commentText: { type: String, required: true },
  commentUpvotes: { type: Number, required: true },
  commentDownvotes: { type: Number, required: true },
  commentTimeStamp: { type: String, required: true },
  parent: { type: [String], default: null },
  commentReplies: [{ type: Schema.Types.Mixed, default: [] }] // Handle nested comments
});

// Esquema para comment
const CommentSchema: Schema<IComment> = new Schema({
  movieId: { type: String, required: true },
  movieImageURI: { type: String, required: true },
  comments: [UserCommentSchema]
});

// Modelos
const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;
