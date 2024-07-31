import express from 'express';
import { logger } from '../helpers/logger';
import { movieAuth } from '../middleware/auth';
import { addComment, deleteComment, getCommentsForPost, setDownvotes, setUpvotes, updateSingleComment } from '../services/commentService';
import { returnMovies } from '../services/discoverMoviesService';
import { getMoviesFromDatabase, getPlaylistsFromDatabase, writeToDatabase } from '../services/movieDbService';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @Route /api/movies/movieGeneration
 * @Desc Retrieve user input and filter movies
 */
router.post('/movieGeneration', movieAuth, async (req, res) => {
    try {
        const id = req.body.user ? req.body.user.id : null;
        const formattedMovies = await returnMovies(req.body.MovieGenerationModel);

        if (id) {
            try {
                await writeToDatabase(formattedMovies, id);
                logger.info(`Movie successfully wrote to DB`);
            } catch (err) {
                logger.error(`Failed to write movies to DB: ${err.message}`);
                return res.status(500).send('Failed to write movies to DB');
            }
        }

        const isRevised = req.body.MovieGenerationModel !== formattedMovies.movieSearchCriteria;
        const returnObj = { formattedMovies, isRevised };
        res.send(JSON.stringify(returnObj));
    } catch (err) {
        logger.error(`${err} error in API`);
        res.status(404).send('Error getting movies');
    }
});

/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieves all generations for a user
 */
router.post('/returnMovies', movieAuth, async (req, res) => {
    try {
        const id = req.body.user ? req.body.user.id : null;
        if (!id) return res.status(401).send('Please log in to access previous curations');

        const userMovieGenerations = await getMoviesFromDatabase(id);
        if (userMovieGenerations) {
            res.status(200).send(userMovieGenerations);
        } else {
            res.status(404).send('Unable to find user movies');
        }
    } catch (err) {
        logger.error(err);
        res.status(404).send('Unable to find user movies');
    }
});

/**
 * @Route /api/movies/getPlaylists
 * @Desc Retrieves all user playlists from database
 */
router.post('/getPlaylists', movieAuth, async (req, res) => {
    try {
        const id = req.body.user ? req.body.user.id : null;
        if (!id) return res.status(401).send('Please log in to see your playlists');

        const playlists = await getPlaylistsFromDatabase(id);
        res.send(JSON.stringify(playlists));
    } catch (err) {
        logger.error(`Failed to get playlists ${err.message}`);
        res.status(404).send('Failed to get user playlists from database');
    }
});

/**
 * @Route /api/movies/comments/addComments
 * @Desc Adds a comment to the database
 */
router.post('/comments/addComments', movieAuth, async (req, res) => {
    try {
        const commentAdded = await addComment(req.body);
        res.send(commentAdded);
    } catch (err) {
        logger.error(`Failed to add comment: ${err.message}`);
        res.status(500).send('Sorry, but your comment could not be added right now, please try again later');
    }
});

/**
 * @Route /api/movies/comments/getComments
 * @param postId: ID of post to query in DB
 * @Desc Retrieves comments for a specific post
 */
router.get('/comments/getComments/:postId', async (req, res) => {
    try {
        const comments = await getCommentsForPost(req.params.postId);
        res.send(comments);
    } catch (err) {
        logger.error(`Failed to get comments: ${err.message}`);
        res.status(500).send('Failed to get comments for this post');
    }
});

/**
 * @Route /api/movies/comments/update
 * @Desc Updates a comment in the database
 */
router.post('/comments/update', movieAuth, async (req, res) => {
    try {
        const { commentText, commentId } = req.body;
        await updateSingleComment({ id: commentId, commentText });
        res.send('Comment updated successfully');
    } catch (err) {
        logger.error(`Failed to update comment: ${err.message}`);
        res.status(500).send('Failed to update comment');
    }
});

/**
 * @Route /api/movies/comments/delete/:commentId
 * @Desc Deletes a comment from the database
 */
router.get('/comments/delete/:commentId', movieAuth, async (req, res) => {
    try {
        const result = await deleteComment(req.params.commentId);
        res.send(result);
    } catch (err) {
        logger.error(`Failed to delete comment: ${err.message}`);
        res.status(500).send('Failed to delete comment, try again later');
    }
});

/**
 * @Route /api/movies/comments/increase/score/:commentId/:commentScore
 * @Desc Increases the score of a comment
 */
router.get('/comments/increase/score/:commentId/:commentScore', movieAuth, async (req, res) => {
    try {
        const comment = await setUpvotes(req.params.commentId, parseInt(req.params.commentScore, 10));
        res.send(comment);
    } catch (err) {
        logger.error(`Failed to increase comment score: ${err.message}`);
        res.status(500).send('Failed to increase score');
    }
});

/**
 * @Route /api/movies/comments/decrease/score/:commentId/:commentScore
 * @Desc Decreases the score of a comment
 */
router.get('/comments/decrease/score/:commentId/:commentScore', movieAuth, async (req, res) => {
    try {
        const comment = await setDownvotes(req.params.commentId, parseInt(req.params.commentScore, 10));
        res.send(comment);
    } catch (err) {
        logger.error(`Failed to decrease comment score: ${err.message}`);
        res.status(500).send('Failed to decrease score');
    }
});

// Export router
export default router;
