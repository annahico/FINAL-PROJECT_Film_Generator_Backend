import mongoose from 'mongoose';
import { movieGenerationModel } from '../tsModels/movieGenerationModel';

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    userId: { type: String, required: true },
    userMovies: [
        {
            movieGenerationDate: {
                type: String,
                default: () => new Date().toISOString(),
                required: true,
            },
            movieSearchCriteria: {
                sort_by: { type: String, required: false },
                with_genres: { type: String, required: false },
                'release_date.lte': { type: String, required: false },
                'release_date.gte': { type: String, required: false },
                with_keywords: { type: String, required: false },
                with_companies: { type: String, required: false },
            },
            movies: [
                {
                    movieId: { type: Number, required: true },
                    movieTitle: { type: String, required: false },
                    movieImagePath: { type: String, required: false },
                    movieDescription: { type: String, required: false },
                    movieReleaseYear: { type: String, required: false },
                    movieGenres: { type: String, required: false },
                    moviePopularity: { type: String, required: false },
                }
            ]
        }
    ],
    userPlaylists: {
        weeklyPlaylists: {
            type: new Schema({
                movieGenerationDate: { type: String, required: true },
                movieSearchCriteria: {
                    sort_by: { type: String, required: false },
                    with_genres: { type: [String], required: false },
                    with_keywords: { type: String, required: false },
                },
                movies: [
                    {
                        movieId: { type: Number, required: true },
                        movieTitle: { type: String, required: true },
                        movieImagePath: { type: String, required: true },
                        movieDescription: { type: String, required: true },
                        movieReleaseYear: { type: String, required: false },
                        movieGenres: { type: String, required: true },
                        moviePopularity: { type: String, required: false },
                    }
                ]
            }, { _id: false }),
            required: false,
        },
        monthlyPlaylists: {
            type: new Schema({
                movieGenerationDate: { type: String, required: true },
                movieSearchCriteria: {
                    sort_by: { type: String, required: false },
                    with_genres: { type: [String], required: false },
                    primary_release_year: { type: String, required: false },
                    with_keywords: { type: String, required: false },
                },
                movies: [
                    {
                        movieId: { type: Number, required: true },
                        movieTitle: { type: String, required: true },
                        movieImagePath: { type: String, required: true },
                        movieDescription: { type: String, required: true },
                        movieReleaseYear: { type: String, required: false },
                        movieGenres: { type: String, required: true },
                        moviePopularity: { type: String, required: false },
                    }
                ]
            }, { _id: false }),
            required: false,
        },
        allTimePlaylists: {
            type: new Schema({
                movieGenerationDate: { type: String, required: true },
                movieSearchCriteria: {
                    sort_by: { type: String, required: false },
                    with_genres: { type: [String], required: false },
                    primary_release_year: { type: String, required: false },
                    with_keywords: { type: String, required: false },
                },
                movies: [
                    {
                        movieId: { type: Number, required: true },
                        movieTitle: { type: String, required: true },
                        movieImagePath: { type: String, required: true },
                        movieDescription: { type: String, required: true },
                        movieReleaseYear: { type: String, required: false },
                        movieGenres: { type: String, required: true },
                        moviePopularity: { type: String, required: false },
                    }
                ]
            }, { _id: false }),
            required: false,
        }
    }
});

export default mongoose.model<movieGenerationModel>('movies', MovieSchema);
