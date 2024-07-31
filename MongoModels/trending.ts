import mongoose, { Schema } from 'mongoose';

// Define el esquema para la colección de "Trending"
const TrendingSchema = new Schema({
    movieGenerationDate: {
        type: String,
        required: true,
    },
    movieSearchCriteria: {
        sort_by: {
            type: String,
            required: false,
        },
        with_genres: {
            type: String,
            required: false,
        },
        primary_release_year: {
            type: String,
            required: false,
        },
        with_keywords: {
            type: String,
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
            movieImagePath: {
                type: String,
                required: true,
            },
            movieDescription: {
                type: String,
                required: true,
            },
            movieReleaseYear: {
                type: String,
                required: false,
            },
            movieGenres: {
                type: String,
                required: true,
            },
            moviePopularity: {
                type: String,
                required: false,
            },
        },
    ],
});

// Exporta el modelo basado en el esquema
export default mongoose.model("Trending", TrendingSchema);
