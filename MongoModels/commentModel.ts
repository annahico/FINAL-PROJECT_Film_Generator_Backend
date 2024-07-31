import mongoose from 'mongoose';

// Interface para el comentario en la base de datos
export interface Comment extends mongoose.Document {
    movieId: string;
    movieImageURI: string;
    comments: userCommentObj[];
}

// Interface para los comentarios de usuario
export interface userComment {
    commentText: string;
    commentUpvotes: number;
    commentDownvotes: number;
    commentTimeStamp: string;
    parent: null | string[];
    commentReplies: userComment[];
    commentId: string; // Añadido commentId
}

// Interface para el objeto de comentario del usuario
export interface userCommentObj {
    user: {
        userID: string;
        userName: string;
    };
    comments: userComment[];
}

// Interface para el retorno estructurado de comentarios
export interface structureCommentReturn {
    userComments: Comment;
    ids: string[];
}

// Interface para el esquema de comentario en Mongoose
export interface tsCommentSchema {
    movieId: string;
    parentId?: mongoose.Schema.Types.ObjectId;
    postedDate?: string;
    user: {
        userId: mongoose.Schema.Types.ObjectId;
        userName: string;
    };
    depth?: number;
    commentText?: string;
}
