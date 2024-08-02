import express, { Request, Response } from 'express';
import { logger } from '../helpers/logger';
import { auth, getAuth } from '../middleware/auth';
import CommunityMovie from '../MongoModels/communityMovie';
import {
    addComment,
    // checkIfDiscussionExists,
    createCommunityMovie,
    // createDiscussion,
    deleteComment,
    deleteCommunityMovie,
    getAllCommunityMovies,
    getAllDiscussions,
    getCommentsForPost,
    getMovie,
    getSingleCommunityMovie,
    getUserUploadsForSingleUser,
    setScore,
    updateSingleComment,
    updateUserMovie
} from '../services/commentService'; // Mantener importaciones como están
import { checkIfDiscussionExists } from '../services/discussionDbService';
import {
    getMoviesFromDatabase,
    getPlaylistsFromDatabase,
    getSingleGeneration,
    MovieGenerationModel
} from '../services/movieDbService';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @Route /api/movies/movieGeneration
 * @Desc Retrieve user input and filter movies
 */
export const writeToDatabase = async (data: MovieGenerationModel, userId: string): Promise<MovieGenerationModel> => {
    try {
        const newEntry = new CommunityMovie({ ...data, userId }); // Añade el userId si es necesario
        await newEntry.save();
        return newEntry.toObject() as unknown as MovieGenerationModel; // Devuelve el objeto de la película
    } catch (err) {
        logger.error(`Failed to write to database: ${(err as Error).message}`);
        throw err;
    }
};


router.get('/generations/single/:generationId', async (req: Request, res: Response) => {
    try {
        const generation = await getSingleGeneration(req.params.generationId);
        res.json(generation);
    } catch (err) {
        logger.error(`Failed to get single generation: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to get generation' });
    }
});

/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieves all generations for a user
 */
router.get('/returnMovies', getAuth, async (req: Request, res: Response) => {
    const { id } = req.token;
    if (!id) {
        return res.status(401).json({ message: "Please log in to access previous curations" });
    }

    try {
        const userMovieGenerations = await getMoviesFromDatabase(id);
        if (userMovieGenerations) {
            res.status(200).json(userMovieGenerations);
        } else {
            res.status(404).json({ message: 'Unable to find user movies' });
        }
    } catch (err) {
        logger.error(`Error: ${(err as Error).message}`);
        res.status(404).json({ message: 'Unable to find user movies' });
    }
});

/**
 * @Route /api/movies/getPlaylists
 * @Desc Retrieves all user playlists from database
 */
router.get('/getPlaylists', getAuth, async (req: Request, res: Response) => {
    const { id } = req.token;
    if (!id) {
        return res.status(401).json({ message: "Please log in to see your playlists" });
    }

    try {
        const playlists = await getPlaylistsFromDatabase(id);
        res.json(playlists);
    } catch (err) {
        logger.error(`Failed to get playlists: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to get user playlists from database' });
    }
});

router.get('/getMovie/:movieId', async (req: Request, res: Response) => {
    try {
        const movie = await getMovie(req.params.movieId);
        res.json(movie);
    } catch (err) {
        logger.error(`Failed to get movie from DB: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to get movie from database' });
    }
});

router.post('/discussions/create', async (req: Request, res: Response) => {
    try {
        const exists = await checkIfDiscussionExists(req.body.movieId);
        if (!exists) {
            const movie = await createDiscussion(req.body);
            res.json(movie);
        } else {
            res.status(400).json({ message: 'Discussion already exists' });
        }
    } catch (err) {
        logger.error(`Failed to check or create discussion: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to check or create discussion' });
    }
});

/**
 * @Route /api/movies/comments/addComments
 * @Desc Adds a comment to the database
 */
router.post('/comments/addComments', auth, async (req: Request, res: Response) => {
    try {
        const commentAdded = await addComment(req.body);
        res.json(commentAdded);
    } catch (err) {
        logger.error(`Failed to add comment: ${(err as Error).message}`);
        res.status(500).json({ message: 'Sorry, but your comment could not be added right now, please try again later' });
    }
});

/**
 * @Route /api/movies/comments/getComments
 * @Desc Retrieves comments for a post
 */
router.post('/comments/getComments', async (req: Request, res: Response) => {
    try {
        const comments = await getCommentsForPost(req.body.movieId); // Asegúrate de que req.body.movieId esté correcto
        res.json(comments);
    } catch (err) {
        logger.error(`Failed to get comments: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to get comments for this post' });
    }
});

/**
 * @Route /api/movies/comments/update
 * @Desc Updates a single comment
 */
router.post('/comments/update', auth, async (req: Request, res: Response) => {
    const { commentText, commentId } = req.body;
    try {
        const updatedComment = await updateSingleComment(commentId, commentText);
        res.json(updatedComment);
    } catch (err) {
        logger.error(`Failed to update comment: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to update comment' });
    }
});

/**
 * @Route /api/movies/comments/delete/commentId
 * @Desc Deletes a comment
 */
router.get('/comments/delete/:commentId/:userId/:commentUserId', getAuth, async (req: Request, res: Response) => {
    if (req.params.userId !== req.params.commentUserId) {
        return res.status(403).json({ message: 'You do not have the authorization to delete this comment' });
    }

    try {
        const result = await deleteComment(req.params.commentId);
        res.json(result);
    } catch (err) {
        logger.error(`Failed to delete comment: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to delete comment, try again later' });
    }
});

/**
 * @Route /api/movies/comments/score/commentID/commentScore
 * @Desc Sets the score for a comment
 */
router.post('/comments/set/score', auth, async (req: Request, res: Response) => {
    const { commentId, commentScore, value, user, changeFromDownVote, changeFromUpvote } = req.body;
    if (!user) {
        return res.status(401).json({ message: 'Please log in to vote on comments' });
    }

    try {
        const comment = await setScore(commentId, commentScore, value, user.id, changeFromUpvote, changeFromDownVote);
        res.json(comment);
    } catch (err) {
        logger.error(`Failed to increase comment score: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to increase score' });
    }
});

router.get('/discussions/getDiscussions', async (req: Request, res: Response) => {
    try {
        const discussions = await getAllDiscussions();
        res.json(discussions);
    } catch (err) {
        logger.error(`Failed to get all discussions: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to get discussions' });
    }
});

router.post('/indie/create', auth, async (req: Request, res: Response) => {
    const { movieObj, user, currentUser } = req.body;
    if (!user?.id) {
        return res.status(401).json({ message: "Please log in to create a post" });
    }

    try {
        const userMovie = await createCommunityMovie(movieObj, currentUser);
        res.status(200).json(userMovie);
    } catch (err) {
        logger.error(`Failed to add user movie: ${(err as Error).message}`);
        res.status(500).json({ message: 'Failed to add user movie' });
    }
});

router.get('/indie/get', async (req: Request, res: Response) => {
    try {
        const movies = await getAllCommunityMovies();
        res.json(movies);
    } catch (err) {
        logger.error(`Failed to get community movies: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to get community movies' });
    }
});

router.get('/indie/delete/:movieId/:userId/:movieUserId', async (req: Request, res: Response) => {
    if (req.params.userId !== req.params.movieUserId) {
        return res.status(403).json({ message: 'You do not have authorization to delete this movie' });
    }

    try {
        const deleted = await deleteCommunityMovie(req.params.movieId);
        res.json(`Movie successfully deleted: ${deleted}`);
    } catch (err) {
        logger.error(`Failed to delete user movie: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to delete user movie' });
    }
});

router.get('/indie/get/:userId', async (req: Request, res: Response) => {
    try {
        const movies = await getUserUploadsForSingleUser(req.params.userId);
        res.json(movies);
    } catch (err) {
        logger.error(`Failed to get community movies for a single user: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to get user movies for a single user' });
    }
});

router.post('/indie/delete', auth, async (req: Request, res: Response) => {
    const { user, movieDetails } = req.body;
    if (!user || user.id !== movieDetails.userId) {
        return res.status(403).json({ message: "You do not have authorization to delete this movie" });
    }

    try {
        const result = await deleteCommunityMovie(movieDetails.movieId);
        res.json(result);
    } catch (err) {
        logger.error(`Failed to delete community movie: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to delete community movie' });
    }
});

router.post('/indie/user/movie/update', auth, async (req: Request, res: Response) => {
    const { user, movieDetails } = req.body;

    if (!user || movieDetails.user.userId !== user.id) {
        return res.status(403).json({ message: 'You do not have authorization to perform this action' });
    }

    try {
        const updatedMovie = await updateUserMovie(movieDetails);
        res.json(updatedMovie);
    } catch (err) {
        logger.error(`Failed to update community movie: ${(err as Error).message}`);
        res.status(404).json({ message: 'Failed to update community movie' });
    }
});

router.get('/indie/user/single/movie/:movieId', getAuth, async (req: Request, res: Response) => {
    const { id } = req.token;

    if (!id) return res.status(403).json({ message: 'You do not have authorization to update this movie' });

    try {
        const movie = await getSingleCommunityMovie(req.params.movieId, id);
        if (!movie) return res.status(403).json({ message: 'You do not have authorization to update this movie' });
        res.json(movie);
    } catch (err) {
        logger.error(`Failed to get user movie: ${(err as Error).message}`);
        res.status(404).json({ message: 'Unable to get user movie' });
    }
});

export default router;
function createDiscussion(body: any) {
    throw new Error('Function not implemented.');
}

