import mongoose from 'mongoose';

export interface tsCommentSchema {
    movieId: string;
    parentId?: mongoose.Schema.Types.ObjectId;
    postedDate?: string;
    user: {
        userId: mongoose.Schema.Types.ObjectId;
        userName: string;
    };
    depth?: number; // Nota: usa 'number' en vez de 'Number'
    commentText?: string;
    commentDownVotes: number[]; // Cambiado a arreglo de números
    commentUpVotes: number[];   // Cambiado a arreglo de números
    isDeleted: boolean;         // Nota: usa 'boolean' en vez de 'Boolean'
}
