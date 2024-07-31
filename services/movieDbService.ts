import MovieSchema from '../MongoModels/movieModel';
import { logger } from '../helpers/logger';
import { movieGenerationModel, singleGenerationObject } from '../tsModels/movieGernerationModel';

/**
 * @Desc Writes generated movies to the database
 * @param {singleGenerationObject} movieGeneration Generated movies to write to the database
 * @param {string} userId The ID of the user in question
 */
export async function writeToDatabase(movieGeneration: singleGenerationObject, userId: string): Promise<void> {
    try {
        const user = await MovieSchema.findOne({ userId: userId });

        if (user) {
            await MovieSchema.updateOne(
                { userId: userId },
                { $push: { userMovies: movieGeneration } }
            );
            logger.info(`Movies have been added to database for user: ${userId}`);
        } else {
            const newUserMovies = new MovieSchema({
                userId: userId,
                userMovies: movieGeneration,
            });

            await newUserMovies.save();
            logger.info(`User movies generated and saved for user: ${userId}`);
        }
    } catch (err) {
        logger.error(`Failed to write movies to the database for user ${userId}: ${err}`);
        throw new Error('Database write operation failed');
    }
}

/**
 * @Desc Get movie curation for a user
 * @param {string} userId The ID of the user
 * @return {Promise<singleGenerationObject[] | string>} A promise resolving to the user's movies or an error message
 */
export async function getMoviesFromDatabase(userId: string): Promise<singleGenerationObject[] | string> {
    try {
        const userMovies: movieGenerationModel | null = await MovieSchema.findOne({ userId: userId });

        if (userMovies) {
            return userMovies.userMovies;
        } else {
            return `Unable to find user movies for ${userId}`;
        }
    } catch (err) {
        logger.error(`Failed to retrieve user movies for ${userId}: ${err}`);
        throw new Error('Database retrieval operation failed');
    }
}
