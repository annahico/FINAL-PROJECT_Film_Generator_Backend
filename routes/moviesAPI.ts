import express from 'express';
import { getMoviesFromDatabase, getPlaylistsFromDatabase, writeToDatabase } from '..//services/movieDbService';
import { logger } from '../helpers/logger';
import { movieAuth } from '../middleware/auth';
import { returnMovies } from '../services/discoverMoviesService';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @Route /api/movies/movieGeneration
 * @Desc Retrieve user input, generate movies, and store them in the database.
 */
router.post('/movieGeneration', movieAuth, (req, res) => {
    const id = req.body.user?.id || null;

    if (!id) {
        return res.status(401).send("Please log in to generate movie curations");
    }

    returnMovies(JSON.parse(JSON.stringify(req.body.MovieGenerationModel)))
        .then((formattedMovies) => {
            if (id) {
                writeToDatabase(formattedMovies, id)
                    .then(() => {
                        logger.info('Movie successfully written to DB');
                    })
                    .catch((err) => {
                        logger.error(`Error writing movie to DB: ${err}`);
                    });
            }
            res.send(JSON.stringify(formattedMovies));
        })
        .catch((err) => {
            logger.error(`Error in movie generation API: ${err}`);
            res.status(500).send('Failed to generate movies');
        });
});

/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieve previously generated movies for the authenticated user.
 */
router.post('/returnMovies', movieAuth, (req, res) => {
    const id = req.body.user?.id || null;

    if (!id) {
        return res.status(401).send("Please log in to access previous curations");
    }

    getMoviesFromDatabase(id)
        .then((userMovieGenerations) => {
            if (userMovieGenerations) {
                res.status(200).send(userMovieGenerations);
            } else {
                res.status(404).send('Unable to find user movies');
            }
        })
        .catch((err) => {
            logger.error(`Failed to retrieve user movies: ${err}`);
            res.status(500).send('Failed to retrieve movies');
        });
});

/**
 * @Route /api/movies/getPlaylists
 * @Desc Retrieve playlists for the authenticated user.
 */
router.post('/getPlaylists', movieAuth, (req, res) => {
    const id = req.body.user?.id || null;

    if (!id) {
        return res.status(401).send("Please log in to see your playlists");
    }

    getPlaylistsFromDatabase(id)
        .then((playlists) => {
            res.send(JSON.stringify(playlists));
        })
        .catch((err) => {
            logger.error(`Failed to get playlists: ${err}`);
            res.status(404).send('Failed to get user playlists from database');
        });
});

export default router;
