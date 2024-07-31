import { logger } from '../helpers/logger';
import MovieDiscussion from '../MongoModels/discussionModel';
import { discussion } from '../tsModels/discussionInterface';
import { movieObject } from '../tsModels/movieGenerationModel';

/**
 * Checks if a discussion exists for a given movie ID.
 * @param movieId - The ID of the movie to check.
 * @returns A promise that resolves to true if the discussion exists, false otherwise.
 */
export async function checkIfDiscussionExists(movieId: number): Promise<boolean> {
    try {
        const discussion = await MovieDiscussion.findOne({ movieId }).exec();
        return !!discussion; // Converts to boolean: true if found, false if not.
    } catch (err) {
        logger.error(`Failed to find movie discussion: ${err.message}`);
        throw err;
    }
}

/**
 * Creates a new discussion in the database.
 * @param movie - The movie object to create a discussion for.
 * @returns A promise that resolves to true if the discussion was created successfully.
 */
export async function createDiscussion(movie: movieObject): Promise<boolean> {
    try {
        await new MovieDiscussion(movie).save();
        return true;
    } catch (err) {
        logger.error(`Failed to create new discussion: ${err.message}`);
        throw err;
    }
}

/**
 * Retrieves all discussions from the database.
 * @returns A promise that resolves to an array of discussions.
 */
export async function getAllDiscussions(): Promise<discussion[]> {
    try {
        return await MovieDiscussion.find({}).lean().exec();
    } catch (err) {
        logger.error(`Failed to get all discussions: ${err.message}`);
        throw err;
    }
}
