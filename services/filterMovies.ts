/* eslint-disable */
import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import endpointsConfig from '../endpoints.config';
import { logger } from '../helpers/logger';
import { movieObject, MovieResult, movieSearchCriteriaModel, singleGenerationObject } from '../tsModels/userModel';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB3 || endpointsConfig.TMDB3;
const moviedb = new MovieDb(TMDB_API_KEY);

/**
 * @Desc function returns list of movies from api
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 */
async function getMovies(movieSearchCriteria: movieSearchCriteriaModel): Promise<MovieResult[]> {
    try {
        const movies = await moviedb.discoverMovie(movieSearchCriteria);
        return movies.results;
    } catch (err) {
        logger.error(`${err} in getting Movies`);
        throw new Error();
    }
}

/**
 * @desc function filters the movies
 * @param {any} allMovies JSON from api with list of movies
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 */
async function filterMovies(allMovies: any, movieSearchCriteria: movieSearchCriteriaModel): Promise<singleGenerationObject> {
    let filteredMovies: MovieResult[] = [];
    console.log(allMovies);
    try {
        filteredMovies = allMovies.filter((movie: any, index: number) => index <= 10);
    } catch (err) {
        logger.error(`Error in filtering movies ${err}`);
        throw new Error();
    }

    const movieReturnObj: singleGenerationObject = {
        movieGenerationDate: new Date().toISOString(),
        movieSearchCriteria: movieSearchCriteria,
        movies: [],
    };

    try {
        for (const movie of filteredMovies) {
            const newMovieObj = returnMovieGenerationObject();
            newMovieObj.movieId = movie.id;
            newMovieObj.movieTitle = movie.title;
            newMovieObj.movieDescription = movie.overview;
            newMovieObj.movieReleaseYear = movie.release_date ? movie.release_date.split('-')[0] : undefined;
            // TODO will have to make a dictionary with genres so they can be properly returned
            newMovieObj.movieGenres = movie.genre_ids;
            newMovieObj.moviePopularity = movie.popularity;

            movieReturnObj.movies.push(newMovieObj);
        }
        return movieReturnObj;
    } catch (err) {
        logger.error(`Failed to format movies ${err}`);
        throw new Error();
    }
}

/**
 * @desc place holder for movieGeneration object
 * @return {movieObject} returns a blank movie object
 */
function returnMovieGenerationObject(): movieObject {
    return {
        movieId: 0,
        movieTitle: '',
        movieDescription: '',
        movieReleaseYear: '',
        movieGenres: [],
        moviePopularity: 0,
    };
}

/**
 * @Desc returns formatted movies to the api
 */
export async function returnMovies(): Promise<singleGenerationObject> {
    const movieSearchCriteria: movieSearchCriteriaModel = {
        sort_by: 'popularity.desc',
        with_genres: '28,53',
        primary_release_year: 2015,
    };

    try {
        const movies = await getMovies(movieSearchCriteria);
        const filteredMovies = await filterMovies(movies, movieSearchCriteria);
        return filteredMovies;
    } catch (err) {
        logger.error(`Failed to return movies ${err}`);
        throw new Error();
    }
}
