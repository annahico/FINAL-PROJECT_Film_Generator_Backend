import { logger } from '../helpers/logger';
import MovieSchema from '../MongoModels/movieModel';
import { movieGenerationModel, singleGenerationObject } from "../tsModels/movieGenerationModel";

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
                userMovies: [movieGeneration],
            });
            await newUserMovies.save();
            logger.info(`User Movies generated for: ${userId}`);
        }
    } catch (err) {
        logger.error(`Failed to write movies to database: ${err}`);
        throw new Error(`Failed to write movies to database: ${err}`);
    }
}

export async function getMoviesFromDatabase(userId: string): Promise<movieGenerationModel | string> {
    try {
        const userMovies = await MovieSchema.findOne({ userId: userId });

        if (userMovies) {
            return userMovies.userMovies;
        } else {
            return `Unable to find user movies for ${userId}`;
        }
    } catch (err) {
        logger.error(`Failed to get movies from database: ${err}`);
        throw new Error(`Failed to get movies from database: ${err}`);
    }
}
