import mongoose, { Schema } from 'mongoose';


const Trending = new Schema({
    movieGenerationDate: {
        type: String,
        required: true,
    },
    movieSearchCriteria: {
        sort_by: {
            type: String,
            required: true,
        },
        with_genres: {
            type: String,
            required: true,
        },
        primary_release_year: {
            type: String,
            required: true,
        },
        with_keywords: {
            type: String,
            required: true
        }
    },
    movies:
        [
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
                    required: true
                },
                movieDescription: {
                    type: String,
                    required: true,
                },
                movieReleaseYear: {
                    type: String,
                    required: true,
                },
                movieGenres: {
                    type: String,
                    required: true,
                },
                moviePopularity: {
                    type: String,
                    required: true,
                },

            },
        ],
});

export default mongoose.model("trending", Trending);