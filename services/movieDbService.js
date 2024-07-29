import { logger } from '../helpers/logger';
import MovieSchema from '../models/movie';

/**
 * @Desc Writes movies to the database for a specific user
 * @param {Object} movieGeneration Generated movies to write to the database
 * @param {String} userId The ID of the user in question
 */
export async function writeToDatabase(movieGeneration, userId) {
    try {
        const user = await MovieSchema.findOne({ userId });

        if (user) {
            await MovieSchema.updateOne(
                { userId },
                { $push: { userMovies: movieGeneration } }
            );
            logger.info(`Movies for user ${userId} have been added to the database`);
        } else {
            const newUserMovies = new MovieSchema({
                userId,
                userMovies: [movieGeneration], // Wrap in an array for consistency
            });
            await newUserMovies.save();
            logger.info(`User Movies generated and saved for: ${userId}`);
        }
    } catch (err) {
        logger.error(`Failed to write to database: ${err.message}`);
        throw new Error(`Failed to write to database: ${err.message}`);
    }
}

/**
 * @Desc Gets movie curation for a user
 * @param {String} userId The ID of the user
 * @returns {Promise<Array>} The list of user movies
 */
export async function getMoviesFromDatabase(userId) {
    try {
        const movieGens = await MovieSchema.findOne({ userId });
        if (!movieGens) {
            logger.warn(`No movies found for user ${userId}`);
            return [];
        }
        return movieGens.userMovies;
    } catch (err) {
        logger.error(`Failed to retrieve movies from database: ${err.message}`);
        throw new Error(`Failed to retrieve movies from database: ${err.message}`);
    }
}
