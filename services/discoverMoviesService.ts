/* eslint-disable */
import { MovieDb } from 'moviedb-promise';
import endpointsConfig from '../endpoints.config';
import { logger } from '../helpers/logger';
import { movieObject, MovieResult, movieSearchCriteriaModel, singleGenerationObject } from '../tsModels/movieGernerationModel';

const moviedb = new MovieDb(endpointsConfig.TMDB3);

/**
 * @Desc function returns list of movies from the API
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 * @return {Promise<MovieResult[] | undefined>} A promise resolving to a list of movies or undefined
 */
async function getMovies(movieSearchCriteria: movieSearchCriteriaModel): Promise<MovieResult[] | undefined> {
    try {
        const movies = await moviedb.discoverMovie(movieSearchCriteria);
        return movies.results;
    } catch (err) {
        logger.error(`Error in getting movies: ${err}`);
        throw new Error('Failed to retrieve movies');
    }
}

/**
 * @Desc function filters the movies
 * @param {MovieResult[]} allMovies JSON from API with list of movies
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 * @return {Promise<singleGenerationObject>} A promise resolving to a filtered list of movies
 */
async function filterMovies(allMovies: MovieResult[], movieSearchCriteria: movieSearchCriteriaModel): Promise<singleGenerationObject> {
    let filteredMovies: MovieResult[] = [];
    
    try {
        filteredMovies = allMovies.slice(0, 10); // Select the top 10 movies
    } catch (err) {
        logger.error(`Error in filtering movies: ${err}`);
        throw new Error('Failed to filter movies');
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
            newMovieObj.movieGenres = movie.genre_ids;
            newMovieObj.moviePopularity = movie.popularity;

            movieReturnObj.movies.push(newMovieObj);
        }
        return movieReturnObj;
    } catch (err) {
        logger.error(`Failed to format movies: ${err}`);
        throw new Error('Failed to format movies');
    }
}

/**
 * @Desc Place holder for movieGeneration object
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
 * @Desc Returns formatted movies to the API
 * @return {Promise<singleGenerationObject>} A promise resolving to the final movie object
 */
export async function returnMovies(): Promise<singleGenerationObject> {
    const movieSearchCriteria: movieSearchCriteriaModel = {
        sort_by: 'popularity.desc',
        with_genres: '28,53',
        primary_release_year: 2015,
    };

    try {
        const movies = await getMovies(movieSearchCriteria);
        if (!movies) throw new Error('No movies found');
        
        const filteredMovies = await filterMovies(movies, movieSearchCriteria);
        return filteredMovies;
    } catch (err) {
        logger.error(`Failed to return movies: ${err}`);
        throw new Error('Failed to return movies');
    }
}
