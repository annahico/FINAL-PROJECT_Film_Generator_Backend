import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Crear el esquema para los comentarios
const CommentSchema = new Schema({
  movieId: {
    type: String,
    required: true
  },
  movieImagePath: {
    type: String,
    required: true
  }
});

// Crear el modelo a partir del esquema
const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel;
