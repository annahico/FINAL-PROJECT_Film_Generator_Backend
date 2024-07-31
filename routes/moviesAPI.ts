import express, { Request, Response } from 'express';
import { movieAuth } from '../middleware/auth';
import { returnMovies } from '../services/discoverMoviesService';

const router = express.Router();

// @route GET /movies
router.get('/movies', movieAuth, async (req: Request, res: Response) => {
    try {
        const movies = await returnMovies();
        res.json(movies);
    } catch (err: unknown) {
        res.status(500).send('Server error');
    }
});
