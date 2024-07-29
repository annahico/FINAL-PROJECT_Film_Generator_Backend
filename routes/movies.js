import express from 'express';
import { logger } from '../../helpers/logger';
import { returnMovies } from '../../services/filterMovies';
import { getMoviesFromDatabase, writeToDatabase } from '../../services/movieDbService';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @Route /api/movies/testingMovies
 * @Desc Retrieve and filter movies, then write to database
 */
router.get('/testingMovies', async (req, res) => {
    try {
        // Obtener y formatear las películas
        const formattedMovies = await returnMovies();

        // Guardar las películas en la base de datos
        await writeToDatabase(formattedMovies, 'kieran@123.ie');

        // Enviar respuesta al cliente
        res.json(formattedMovies);
    } catch (err) {
        logger.error(`Error in /api/movies/testingMovies: ${err.message}`);
        res.status(500).send('An error occurred while processing your request.');
    }
});

/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieve movies from the database
 */
router.get('/returnMovies', async (req, res) => {
    try {
        // Obtener películas de la base de datos
        const userMovieGenerations = await getMoviesFromDatabase('kieran@123.ie');
        res.json(userMovieGenerations);
    } catch (err) {
        logger.error(`Error in /api/movies/returnMovies: ${err.message}`);
        res.status(500).send('An error occurred while retrieving movies from the database.');
    }
});

export default router;
