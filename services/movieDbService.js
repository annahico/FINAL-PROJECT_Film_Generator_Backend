import { logger } from '../helpers/logger';
import MovieSchema from '../models/movieModel'; // Usa solo una importación del modelo

/**
 * @Desc Writes generated movies to the database
 * @param {Object} movieGeneration Generated movies to write to the database
 * @param {String} userId The ID of the user in question
 */
export async function writeToDatabase(movieGeneration, userId) {
    try {
        const user = await MovieSchema.findOne({ userId: userId });

        if (user) {
            // Si el usuario ya existe, actualizamos su lista de películas
            await MovieSchema.updateOne(
                { userId: userId },
                { $push: { userMovies: movieGeneration } }
            );
            logger.info(`Movies for user ${userId} have been updated in the database.`);
        } else {
            // Si el usuario no existe, creamos un nuevo documento
            const newUserMovies = new MovieSchema({
                userId: userId,
                userMovies: [movieGeneration],
            });

            await newUserMovies.save();
            logger.info(`User movies created for ${userId}.`);
        }
    } catch (err) {
        logger.error(`Failed to write movies to the database: ${err.message}`);
        throw new Error('Failed to write movies to the database');
    }
}

/**
 * @Desc Gets movie curation for a user from the database
 * @param {String} userId The ID of the user
 * @returns {Promise<Array|String>} The user's movies or an error message
 */
export async function getMoviesFromDatabase(userId) {
    try {
        const userMovies = await MovieSchema.findOne({ userId: userId });

        if (userMovies) {
            return userMovies.userMovies;
        } else {
            return `Unable to find user movies for ${userId}`;
        }
    } catch (err) {
        logger.error(`Failed to retrieve movies from the database: ${err.message}`);
        throw new Error('Failed to retrieve movies from the database');
    }
}
