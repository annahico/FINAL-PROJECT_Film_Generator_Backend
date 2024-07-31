import express from 'express';
import { logger } from '../helpers/logger';
import { movieAuth } from '../middleware/auth';
import { returnMovies } from '../services/discoverMoviesService';
import { getMoviesFromDatabase, writeToDatabase } from '../services/movieDbService';

const router = express.Router();

/**
 * @Route POST /api/movies/movieGeneration
 * @Desc Retrieve user input, filter movies, and optionally store them in the database
 */
router.post('/movieGeneration', movieAuth, async (req, res) => {
    const id = req.body.user ? req.body.user.id : null;

    try {
        const formattedMovies = await returnMovies(req.body);

        if (id) {
            try {
                await writeToDatabase(formattedMovies, id);
                logger.info('Movie successfully written to DB');
            } catch (err) {
                logger.error('Error writing movie to DB:', err);
            }
        }

        res.json(formattedMovies);
    } catch (err) {
        logger.error('Error generating movies:', err);
        res.status(500).send('Server error');
    }
});

/**
 * @Route GET /api/movies/returnMovies
 * @Desc Retrieve movies from the database for a specific user
 */
router.get('/returnMovies', async (req, res) => {
    try {
        const userMovieGenerations = await getMoviesFromDatabase('kieran@123.ie');

        if (typeof userMovieGenerations === 'string') {
            res.status(404).send(userMovieGenerations);
        } else {
            res.json(userMovieGenerations);
        }
    } catch (err) {
        logger.error('Error retrieving movies from DB:', err);
        res.status(500).send('Server error');
    }
});

export default router;
