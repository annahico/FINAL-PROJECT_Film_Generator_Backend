import MovieSchema from '../MongoModels/movieModel';
import TrendingSchema from '../MongoModels/trending';
import { logger } from '../helpers/logger';
import { singleGenerationObject } from '../tsModels/movieGenerationModel';

/**
 * Check if user exists in the database
 * @param {String} userId
 */
async function getUser(userId: string) {
    try {
        return await MovieSchema.findOne({ userId }).lean();
    } catch (err) {
        logger.error(`Error in getting user: ${err.message}`);
        throw err;
    }
}

/**
 * Write generated movies to the database for a specific user
 * @param {singleGenerationObject} userMovies - Generated movies to write to the database
 * @param {String} userId - The ID of the user in question
 */
export async function writeToDatabase(userMovies: singleGenerationObject, userId: string): Promise<singleGenerationObject | undefined> {
    try {
        const user = await getUser(userId);

        if (user) {
            const updatedUser = await MovieSchema.findOneAndUpdate(
                { userId },
                { $push: { userMovies } },
                { new: true, lean: true }
            );

            const lastElem = updatedUser?.userMovies.length || null;
            if (lastElem) {
                return updatedUser.userMovies[lastElem - 1];
            }
        } else {
            const newuserMovies = new MovieSchema({
                userId,
                userMovies
            });

            const res = await newuserMovies.save();
            return res.userMovies[0];
        }
    } catch (err) {
        logger.error(`Error writing to database: ${err.message}`);
        throw err;
    }
}

/**
 * Get all movie curations for a specific user
 * @param {String} userId
 */
export async function getMoviesFromDatabase(userId: string): Promise<singleGenerationObject[] | null> {
    try {
        const user = await getUser(userId);
        return user ? user.userMovies : null;
    } catch (err) {
        logger.error(`Error retrieving user movies: ${err.message}`);
        throw err;
    }
}

/**
 * Get playlists and trending movies for a specific user
 * @param {String} userId
 */
export async function getPlaylistsFromDatabase(userId: string) {
    try {
        const trendingNow = await getTrendingNowPage();
        const user = await getUser(userId);

        return {
            userPlaylists: user?.userPlaylists || [],
            trendingNow
        };
    } catch (err) {
        logger.error(`Failed to get playlists from database: ${err.message}`);
        throw err;
    }
}

/**
 * Get the trending movies page
 */
async function getTrendingNowPage() {
    try {
        const trending = await TrendingSchema.find({}).lean();
        return trending[0];
    } catch (err) {
        logger.error(`Failed to get trending now page: ${err.message}`);
        throw err;
    }
}

/**
 * Get all movies from the database
 */
export async function getAllMovies() {
    try {
        return await MovieSchema.find({}).lean();
    } catch (err) {
        logger.error(`Failed to get all movies: ${err.message}`);
        throw err;
    }
}

/**
 * Get a single generation by its ID
 * @param {String} generationId
 */
export async function getSingleGeneration(generationId: string) {
    try {
        const generations = await MovieSchema.findOne({ 'userMovies._id': generationId }).lean();
        return generations?.userMovies.find(generation => generation._id.toString() === generationId);
    } catch (err) {
        logger.error(`Failed to get single generation from database: ${err.message}`);
        throw err;
    }
}
