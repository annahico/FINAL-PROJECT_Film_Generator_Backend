const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,  // Elimina los espacios en blanco al principio y al final del comentario
    },
    rating: {
        type: Number,  // Cambiado a Number para una validación más sólida de calificaciones
        required: true,
        min: 1,  // Valor mínimo de la calificación
        max: 5,  // Valor máximo de la calificación (asumiendo una escala de 1 a 5)
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
