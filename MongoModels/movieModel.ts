import mongoose from 'mongoose';
// import { movieGenerationModel } from '../tsModels/movieGenerationModel'; 

const { Schema } = mongoose;

const MovieSchema = new Schema({
    userId: {
        type: String,
        required: true,
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
                    type: [String], // Assuming genres are strings, adjust if otherwise
                    required: true,
                },
                primary_release_year: {
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
                    movieDescription: {
                        type: String,
                        required: true,
                    },
                    movieReleaseYear: {
                        type: String,
                        required: false,
                    },
                    movieGenres: {
                        type: [String], // Assuming genres are strings, adjust if otherwise
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

// Export the schema model correctly
export default mongoose.model<movieGenerationModel>('movies', MovieSchema);
