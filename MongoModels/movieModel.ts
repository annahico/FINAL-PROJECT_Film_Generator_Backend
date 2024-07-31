import mongoose, { Document, Schema } from 'mongoose';
import { movieGenerationModel } from '../tsModels/movieGernerationModel';

// Define the structure of movie schema
const MovieSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userMovies: [
        {
            movieGenerationDate: {
                type: String,
                required: true,
            },
            movieSearchCriteria: {
                sort_by: {
                    type: String,
                    required: false,  // Only need to specify required once
                },
                with_genres: {
                    type: [String],  // Array of strings, fixed the type declaration
                    required: false,
                },
                primary_release_year: {
                    type: String,
                    required: false,
                },
                with_keywords: {
                    type: String,
                    required: false,
                }
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
                        type: [String],  // Array of strings for genres
                        required: true,
                    },
                    moviePopularity: {
                        type: Number,  // Movie popularity should be a number
                        required: false,
                    },
                    movieImagepath: {
                        type: String,
                        required: false,
                    }
                }
            ]
        }
    ]
});

// Export the model based on the movieGenerationModel interface
export default mongoose.model<movieGenerationModel & Document>('Movie', MovieSchema);
