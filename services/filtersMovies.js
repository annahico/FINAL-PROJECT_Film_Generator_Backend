import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import { logger } from '../helpers/logger';

// Cargar variables de entorno
dotenv.config();
const { TMDB3 } = process.env;

// Verificar la existencia de la clave API
if (!TMDB3) {
    logger.error('TMDB API key not found in environment variables');
    throw new Error('TMDB API key not found');
}

const moviedb = new MovieDb(TMDB3);

/**
 * @Desc Retrieves a list of movies from the TMDB API.
 * @returns {Promise<Array>} A promise that resolves to an array of movies.
 */
async function getMovies() {
    try {
        const response = await moviedb.discoverMovie({
            sort_by: 'popularity.desc',
            with_genres: '28,53', // Acción y Thriller
            primary_release_year: 2015,
        });
        return response.results;
    } catch (err) {
        logger.error(`Error retrieving movies: ${err.message}`);
        throw new Error('Failed to retrieve movies');
    }
}

/**
 * @Desc Filters and formats the movies.
 * @param {Array} allMovies An array of movies to filter and format.
 * @returns {Object} An object containing the filtered and formatted movies.
 */
async function filterMovies(allMovies) {
    try {
        // Tomar los primeros 10 resultados
        const filteredMovies = allMovies.slice(0, 10);

        const movieReturnObj = {
            movieGenerationDate: new Date().toISOString(),
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
 * @Desc Retrieves and formats movies from the TMDB API.
 * @returns {Promise<Object>} A promise that resolves to an object containing formatted movies.
 */
export async function returnMovies() {
    try {
        const movies = await getMovies();
        const filteredMovies = await filterMovies(movies);
        logger.info('Movies successfully retrieved and filtered');
        return filteredMovies;
    } catch (err) {
        logger.error(`Failed to return movies: ${err.message}`);
        throw new Error('Failed to return movies');
    }
}
