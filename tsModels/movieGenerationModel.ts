import { Document, Schema, model } from "mongoose";

// Define the interfaces
export interface MovieGenerationModel extends Document { 
    userId: string;
    userMovies: SingleGenerationObject[];
}

export interface SingleGenerationObject {
    movieGenerationDate: string;                
    movieSearchCriteria: MovieSearchCriteriaModel;
    movies: MovieObject[];
}

export interface MovieObject {
    movieId: number | undefined;
    movieTitle: string | undefined;
    movieDescription: string | undefined;
    movieReleaseYear: string | undefined;
    movieGenres: number[] | undefined;
    moviePopularity: number | undefined;
}

export interface MovieSearchCriteriaModel {
    region?: string;
    sort_by?: 'popularity.asc' | 'popularity.desc' | 'release_date.asc' | 'release_date.desc' | 'revenue.asc' | 'revenue.desc' | 'primary_release_date.asc' | 'primary_release_date.desc' | 'original_title.asc' | 'original_title.desc' | 'vote_average.asc' | 'vote_average.desc' | 'vote_count.asc' | 'vote_count.desc';
    certification_country?: string;
    certification?: string;
    'certification.lte'?: string;
    'certification.gte'?: string;
    include_adult?: boolean;
    include_video?: boolean;
    page?: number;
    primary_release_year?: number;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
    'release_date.gte'?: string;
    'release_date.lte'?: string;
    with_release_type?: number;
    year?: number;
    'vote_count.gte'?: number;
    'vote_count.lte'?: number;
    'vote_average.gte'?: number;
    'vote_average.lte'?: number;
    with_cast?: string;
    with_crew?: string;
    with_people?: string;
    with_companies?: string;
    with_genres?: string;
    without_genres?: string;
    with_keywords?: string;
    without_keywords?: string;
    'with_runtime.gte'?: number;
    'with_runtime.lte'?: number;
    with_original_language?: string;
}

export interface MovieResult {
    poster_path?: string;
    adult?: boolean;
    overview?: string;
    release_date?: string;
    genre_ids?: number[];
    id?: number;
    media_type: 'movie';
    original_title?: string;
    original_language?: string;
    title?: string;
    backdrop_path?: string;
    popularity?: number;
    vote_count?: number;
    video?: boolean;
    vote_average?: number;
}

// Define the schema
const MovieSchema = new Schema<MovieGenerationModel>({
    userId: { type: String, required: true },
    userMovies: [{
        movieGenerationDate: { type: String, required: true },
        movieSearchCriteria: {
            region: String,
            sort_by: { type: String, enum: ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc'] },
            certification_country: String,
            certification: String,
            'certification.lte': String,
            'certification.gte': String,
            include_adult: Boolean,
            include_video: Boolean,
            page: Number,
            primary_release_year: Number,
            'primary_release_date.gte': String,
            'primary_release_date.lte': String,
            'release_date.gte': String,
            'release_date.lte': String,
            with_release_type: Number,
            year: Number,
            'vote_count.gte': Number,
            'vote_count.lte': Number,
            'vote_average.gte': Number,
            'vote_average.lte': Number,
            with_cast: String,
            with_crew: String,
            with_people: String,
            with_companies: String,
            with_genres: String,
            without_genres: String,
            with_keywords: String,
            without_keywords: String,
            'with_runtime.gte': Number,
            'with_runtime.lte': Number,
            with_original_language: String
        },
        movies: [{
            movieId: Number,
            movieTitle: String,
            movieDescription: String,
            movieReleaseYear: String,
            movieGenres: [Number],
            moviePopularity: Number,
        }]
    }]
});

// Create and export the model
export default model<MovieGenerationModel>('Movie', MovieSchema);
