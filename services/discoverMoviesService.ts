import { logger } from '../helpers/logger';
import MovieSchema from '../MongoModels/movieModel';
import TrendingSchema from '../MongoModels/trending';
import { singleGenerationObject } from '../tsModels/movieGenerationModel';

/**
 * Retrieve and format movies based on the provided model.
 * @param {singleGenerationObject} movieGenerationModel - The model used to generate movie recommendations.
 * @returns {Promise<any>} - The formatted movie results.
 */
export async function returnMovies(movieGenerationModel: singleGenerationObject): Promise<any> {
    try {
        // Example implementation, replace with actual logic to generate movies
        // based on movieGenerationModel.
        const movies = await MovieSchema.find({}).lean(); // Mock implementation
        const formattedMovies = {
            movieSearchCriteria: movieGenerationModel, // Assuming this is a search criteria object
            movies
        };
        return formattedMovies;
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to retrieve movies: ${err.message}`);
        } else {
            logger.error('Failed to retrieve movies: Unknown error');
        }
        throw err;
    }
}

/**
 * Write formatted movies to the database.
 * @param {singleGenerationObject} formattedMovies - The formatted movies to save.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<singleGenerationObject>} - The saved movies object.
 */
export async function writeToDatabase(formattedMovies: singleGenerationObject, userId: string): Promise<singleGenerationObject> {
    try {
        // Add logic to save formattedMovies to the database for the specific user
        // Here, you might be adding the formatted movies to the user's document
        const user = await MovieSchema.findOneAndUpdate(
            { userId },
            { $push: { userMovies: formattedMovies } },
            { new: true, lean: true }
        );
        
        if (!user) {
            throw new Error('User not found');
        }

        return user.userMovies[user.userMovies.length - 1];
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to write movies to database: ${err.message}`);
        } else {
            logger.error('Failed to write movies to database: Unknown error');
        }
        throw err;
    }
}

/**
 * Get all generations from the database for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<singleGenerationObject[]>} - The list of movie generations.
 */
export async function getMoviesFromDatabase(userId: string): Promise<singleGenerationObject[]> {
    try {
        const user = await MovieSchema.findOne({ userId }).lean();
        return user ? user.userMovies : [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to retrieve movies from database: ${err.message}`);
        } else {
            logger.error('Failed to retrieve movies from database: Unknown error');
        }
        throw err;
    }
}

/**
 * Get all playlists and trending movies for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - The playlists and trending movies.
 */
export async function getPlaylistsFromDatabase(userId: string): Promise<any> {
    try {
        // Mock implementation of getting trending movies
        const trendingNow = await TrendingSchema.find({}).lean();
        const user = await MovieSchema.findOne({ userId }).lean();

        return {
            userPlaylists: user?.userPlaylists || [],
            trendingNow: trendingNow[0] || {}
        };
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to retrieve playlists and trending movies: ${err.message}`);
        } else {
            logger.error('Failed to retrieve playlists and trending movies: Unknown error');
        }
        throw err;
    }
}

/**
 * Get a single generation by its ID.
 * @param {string} generationId - The ID of the generation.
 * @returns {Promise<any>} - The generation object.
 */
export async function getSingleGeneration(generationId: string): Promise<any> {
    try {
        const generation = await MovieSchema.findOne({ 'userMovies._id': generationId }).lean();
        return generation?.userMovies.find(gen => gen._id.toString() === generationId);
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to get single generation: ${err.message}`);
        } else {
            logger.error('Failed to get single generation: Unknown error');
        }
        throw err;
    }
}
