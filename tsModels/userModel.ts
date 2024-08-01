import mongoose from "mongoose";

// Definición para el modelo de usuario
export interface userModel extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    userName: string;
    Date: Date;
}

// Definición para el modelo de login
export interface loginModel {
    token: string;
    user: {
        name: string;
        email: string;
    };
}

// Definición para los criterios de búsqueda de películas
export interface movieSearchCriteriaModel {
    sort_by?: string;
    with_genres?: string;
    primary_release_year?: number;
}

// Definición para el resultado de la búsqueda de películas
export interface MovieResult {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    genre_ids: number[];
    popularity: number;
}

// Definición para el objeto de una película
export interface movieObject {
    movieId: number;
    movieTitle: string;
    movieDescription: string;
    movieReleaseYear: string;
    movieGenres: number[];
    moviePopularity: number;
}

// Definición para el objeto de generación de películas
export interface singleGenerationObject {
    movieGenerationDate: string;
    movieSearchCriteria: movieSearchCriteriaModel;
    movies: movieObject[];
}
