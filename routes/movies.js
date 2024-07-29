import express from 'express';
import { logger } from '../../helpers/logger';
import { movies } from '../../helpers/theMovieDb';
import { returnMovies } from '../../services/filterMovies';
import { getMoviesFromDatabase, writeToDatabase } from '../../services/movieDbService';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @Route /api/movies/testingMovies
 * @Desc Retrieve movies, format them, and write to the database
 */
router.get('/testingMovies', async (req, res) => {
    try {
        // Obtener películas (aunque en este caso no se usa `movieData`)
        await movies();  // Puedes usar esta línea para hacer una llamada a la API si es necesario para los registros

        // Formatear películas
        const formattedMovies = await returnMovies();

        // Guardar en la base de datos
        await writeToDatabase(formattedMovies, 'kieran@123.ie');

        // Enviar respuesta al cliente
        res.send(JSON.stringify(formattedMovies));
    } catch (err) {
        // Manejar errores
        logger.error(`${err} error in api`);
        res.status(500).send('An error occurred');
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
        res.send(userMovieGenerations);
    } catch (err) {
        // Manejar errores
        logger.error(err);
        res.status(500).send('An error occurred');
    }
});

export default router;
