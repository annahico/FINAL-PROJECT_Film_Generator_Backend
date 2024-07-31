import express from 'express';
import { logger } from '../helpers/logger';
import { auth } from '../middleware/auth';
import { createDiscussion } from '../services/discussionDbService';

const router = express.Router();

/**
 * @Route /api/discussions/create
 * @Desc Create a new discussion
 * @Access Private (Requires authentication)
 */
router.post('/create', auth, async (req, res) => {
    try {
        const { movieId, movieTitle, movieDescription } = req.body;

        if (!movieId || !movieTitle || !movieDescription) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Attempt to create a new discussion
        const discussionCreated = await createDiscussion({ movieId, movieTitle, movieDescription });

        if (discussionCreated) {
            res.status(201).json({ message: 'Discussion created successfully' });
        } else {
            res.status(500).json({ error: 'Failed to create discussion' });
        }
    } catch (err) {
        logger.error(`Failed to create discussion: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
