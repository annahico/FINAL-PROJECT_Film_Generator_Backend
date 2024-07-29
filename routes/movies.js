import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de película
const MovieSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, // Si se refiere a un documento de usuario en otro modelo
        ref: 'User', // Referencia al modelo de usuario
        required: true
    },
    userMovies: [
        {
            movieGenerationDate: {
                type: Date,
                required: true
            },
            movies: [
                {
                    movieId: {
                        type: Number,
                        required: true
                    },
                    movieTitle: {
                        type: String,
                        required: true
                    },
                    movieDescription: {
                        type: String,
                        required: true
                    },
                    movieReleaseYear: {
                        type: Number, // Usar Number para años
                        required: false
                    },
                    movieGenres: {
                        type: [String], // Array de strings para los géneros
                        required: true
                    },
                    moviePopularity: {
                        type: Number,
                        required: false
                    }
                }
            ]
        }
    ]
});

// Crear índice para `userId` y `movieGenerationDate` si se consultan con frecuencia
MovieSchema.index({ userId: 1, 'userMovies.movieGenerationDate': 1 });

export default mongoose.model('Movie', MovieSchema);
