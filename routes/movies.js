import express from 'express';
import { logger } from '../../helpers/logger';
import { movies } from '../../helpers/theMovieDb';

// eslint-disable-next-line new-cap
const router = express.Router();

// Ruta para probar la obtención de películas
router.get('/testingMovies', async (req, res) => {
    try {
        const movieData = await movies(); // Llama a la función movies() y espera su resultado
        res.status(200).json(movieData); // Enviar datos JSON con estado 200 (OK)
    } catch (err) {
        logger.error(err); // Registra el error
        res.status(500).send('Error al obtener las películas'); // Envía un mensaje de error con estado 500 (Internal Server Error)
    }
});

export default router;
