import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import { logger } from '../helpers/logger';

// Configurar dotenv para obtener variables de entorno
dotenv.config();

// Crear una instancia de MovieDb con la clave API
const moviedb = new MovieDb(process.env.TMDB3);

/**
 * @Desc Retrieves a list of movies from the API based on user search criteria
 * @param {Object} movieSearchCriteria Object containing search parameters for movies
 * @returns {Promise<Array>} List of movies
 */
async function getMovies(movieSearchCriteria) {
    try {
        const movies = await moviedb.discoverMovie(movieSearchCriteria);
        return movies.results;
    } catch (err) {
        logger.error(`Error retrieving movies: ${err.message}`);
        throw new Error('Failed to retrieve movies');
    }
}

/**
 * @Desc Filters and formats the movies
 * @param {Array} allMovies List of movies to filter
 * @param {Object} movieSearchCriteria Object containing search parameters for movies
 * @returns {Object} Filtered and formatted movies
 */
async function filterMovies(allMovies, movieSearchCriteria) {
    try {
        // Filtrar los primeros 10 resultados
        const filteredMovies = allMovies.slice(0, 10);

        const movieReturnObj = {
            movieGenerationDate: new Date().toISOString(),
            movieSearchCriteria: movieSearchCriteria,
            movies: filteredMovies.map((movie) => ({
                movieId: movie.id,
                movieTitle: movie.title,
                movieDescription: movie.overview,
                movieReleaseYear: movie.release_date.split('-')[0],
                movieGenres: movie.genre_ids,
                moviePopularity: movie.popularity,
            })),
        };

        return movieReturnObj;
    } catch (err) {
        logger.error(`Error filtering movies: ${err.message}`);
        throw new Error('Failed to filter movies');
    }
}

/**
 * @Desc Returns formatted movies based on the API
 * @returns {Promise<Object>} Formatted movies
 */
export async function returnMovies() {
    const movieSearchCriteria = {
        sort_by: 'popularity.desc',
        with_genres: '28,53', // Acción y Thriller
        primary_release_year: 2015,
    };

    try {
        const movies = await getMovies(movieSearchCriteria);
        const filteredMovies = await filterMovies(movies, movieSearchCriteria);
        console.log(filteredMovies);
        return filteredMovies;
    } catch (err) {
        logger.error(`Failed to return movies: ${err.message}`);
        throw new Error('Failed to return movies');
    }
}
