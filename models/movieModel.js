import mongoose from 'mongoose';
const { Schema } = mongoose;

const MovieSchema = new Schema({
    userId: {
        type: String,
        required: true, // Asegúrate de que cada documento tenga un userId
    },
    userMovies: [
        {
            movieGenerationDate: {
                type: Date,
                required: true,
            },
            movieSearchCriteria: {
                sort_by: {
                    type: String,
                    required: true,
                },
                with_genres: {
                    type: [String], // Define el tipo de elementos en el array
                    required: true,
                },
                primary_release_year: {
                    type: Number, // Considera usar Number si es un año
                    required: false,
                },
            },
            movies: [
                {
                    movieId: {
                        type: Number,
                        required: true,
                    },
                    movieTitle: {
                        type: String,
                        required: true,
                    },
                    movieDescription: {
                        type: String,
                        required: true,
                    },
                    movieReleaseYear: {
                        type: Number, // Considera usar Number si es un año
                        required: false,
                    },
                    movieGenres: {
                        type: [String], // Define el tipo de elementos en el array
                        required: true,
                    },
                    moviePopularity: {
                        type: Number,
                        required: false,
                    },
                },
            ],
        },
    ],
});

// Crear un índice en userId para mejorar la búsqueda
MovieSchema.index({ userId: 1 });

export default mongoose.model('Movie', MovieSchema);
