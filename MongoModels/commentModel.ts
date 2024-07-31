import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define el esquema para los comentarios
const CommentSchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    depth: {
        type: Number,
        default: 1
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    postedDate: {
        type: String,
        default: new Date().toISOString()
    },
    user: {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String
    },
    commentText: {
        type: String,
        required: true
    },
    commentScore: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    commentUpVotes: {
        type: [mongoose.Schema.Types.ObjectId], // Cambiado a un array de ObjectId
        default: []
    },
    commentDownVotes: {
        type: [mongoose.Schema.Types.ObjectId], // Cambiado a un array de ObjectId
        default: []
    }
});

// Exporta el modelo basado en el esquema
export default mongoose.model('Comment', CommentSchema);
