import { logger } from '../helpers/logger';
import MovieDiscussion from '../MongoModels/discussionModel';
import { movieObject } from '../tsModels/movieGenerationModel';

// Tipo para los resultados de getAllDiscussions
interface Discussion {
    movieId: number;
    // Aquí deberías agregar más propiedades si existen en el modelo
}

export async function checkIfDiscussionExists(movieId: number): Promise<boolean> {
    try {
        const discussion = await MovieDiscussion.findOne({ movieId }).exec();
        return !!discussion;
    } catch (err) {
        logger.error(`Failed to find movie discussion: ${(err as Error).message}`);
        throw err;
    }
}

export async function createDiscussion(movie: movieObject): Promise<boolean> {
    try {
        await new MovieDiscussion(movie).save();
        return true;
    } catch (err) {
        logger.error(`Failed to create new discussion: ${(err as Error).message}`);
        throw err;
    }
}

export async function getAllDiscussions(): Promise<Discussion[]> {
    try {
        const discussions = await MovieDiscussion.find({}).lean().exec();
        return discussions;
    } catch (err) {
        logger.error(`Failed to get all discussions: ${(err as Error).message}`);
        throw err;
    }
}

export async function getMovie(movieId: string): Promise<Discussion[]> {
    try {
        const movies = await MovieDiscussion.find({ movieId }).lean().exec();
        return movies;
    } catch (err) {
        logger.error(`Failed to get movie from database: ${(err as Error).message}`);
        throw err;
    }
}
