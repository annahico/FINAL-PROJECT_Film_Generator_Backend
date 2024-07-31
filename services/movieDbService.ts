import MovieSchema from '../MongoModels/movieModel';
import TrendingSchema from '../MongoModels/trending';
import { logger } from '../helpers/logger';
import { singleGenerationObject } from '../tsModels/movieGenerationModel';

async function getUser(userId: string): Promise<MovieDocument | null> {
    try {
        const user = await MovieSchema.findOne({ userId }).lean();
        return user as MovieDocument | null;
    } catch (err) {
        logger.error(`Failed to get user: ${(err as Error).message}`);
        throw err;
    }
}

export async function writeToDatabase(userMovies: singleGenerationObject, userId: string): Promise<singleGenerationObject | undefined> {
    try {
        const user = await getUser(userId);
        if (user) {
            const written = await MovieSchema.findOneAndUpdate(
                { userId },
                { $push: { userMovies } },
                { new: true }
            ).lean();

            const lastElem = written?.userMovies?.length || null;
            if (lastElem) {
                return written?.userMovies[lastElem - 1];
            }
        } else {
            const newUserMovies = new MovieSchema({
                userId,
                userMovies
            });

            const saved = await newUserMovies.save();
            return saved.userMovies[0];
        }
    } catch (err) {
        logger.error(`Failed to write to database: ${(err as Error).message}`);
        throw err;
    }
}

export async function getMoviesFromDatabase(userId: string): Promise<singleGenerationObject[] | null> {
    try {
        const user = await getUser(userId);
        return user ? user.userMovies : null;
    } catch (err) {
        logger.error(`Failed to get movies from database: ${(err as Error).message}`);
        throw err;
    }
}

export async function getPlaylistsFromDatabase(userId: string): Promise<any> { // Replace `any` with a specific type if available
    try {
        const trendingNow = await getTrendingNowPage();
        const userPlaylists = await getUser(userId);
        return {
            ...userPlaylists,
            trendingNow
        };
    } catch (err) {
        logger.error(`Failed to get playlists from database: ${(err as Error).message}`);
        throw err;
    }
}

async function getTrendingNowPage(): Promise<TrendingDocument | null> {
    try {
        const res = await TrendingSchema.find({}).lean();
        return res[0] || null;
    } catch (err) {
        logger.error(`Failed to get trending now page: ${(err as Error).message}`);
        throw err;
    }
}

export async function getAllMovies(): Promise<singleGenerationObject[]> {
    try {
        return await MovieSchema.find({}).lean();
    } catch (err) {
        logger.error(`Failed to get all movies: ${(err as Error).message}`);
        throw err;
    }
}

export async function getSingleGeneration(generationId: string): Promise<singleGenerationObject | null> {
    try {
        const generations = await MovieSchema.find({ userMovies: { $elemMatch: { _id: generationId } } }).lean();
        return generations[0]?.userMovies.find((generation) => generation._id.toString() === generationId) || null;
    } catch (err) {
        logger.error(`Failed to get single generation from database: ${(err as Error).message}`);
        throw err;
    }
}