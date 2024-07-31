import MovieSchema from '../MongoModels/movieModel';
import { logger } from '../helpers/logger';
import { movieGenerationModel, singleGenerationObject } from '../tsModels/movieGenerationModel';

/**
 * @Desc Writes user-generated movies to the database
 * @param {singleGenerationObject} movieGeneration - Generated movies to write to the database
 * @param {string} userId - The ID of the user in question
 */
export async function writeToDatabase(movieGeneration: singleGenerationObject, userId: string): Promise<void> {
    try {
        const user = await MovieSchema.findOne({ userId });

        if (user) {
            await MovieSchema.updateOne(
                { userId },
                { $push: { userMovies: movieGeneration } }
            );
            logger.info(`Movie data successfully added to the database for user ID: ${userId}`);
        } else {
            const newUserMovies = new MovieSchema({
                userId,
                userMovies: [movieGeneration],
            });

            await newUserMovies.save();
            logger.info(`User movies generated and saved for user ID: ${userId}`);
        }
    } catch (err) {
        logger.error(`Failed to write movies to database for user ID: ${userId} - Error: ${err.message}`);
        throw new Error('Database operation failed');
    }
}

/**
 * @Desc Retrieves movie curation for a user
 * @param {string} userId - The ID of the user whose movies are to be retrieved
 * @return {Promise<singleGenerationObject[] | string>} - A promise that resolves to the user's movie data or an error message
 */
export async function getMoviesFromDatabase(userId: string): Promise<singleGenerationObject[] | string> {
    try {
        const userMovies: movieGenerationModel | null = await MovieSchema.findOne({ userId });

        if (userMovies) {
            return userMovies.userMovies;
        } else {
            return `Unable to find user movies for user ID: ${userId}`;
        }
    } catch (err) {
        logger.error(`Failed to retrieve user movies for user ID: ${userId} - Error: ${err.message}`);
        throw new Error('Database operation failed');
    }
}
