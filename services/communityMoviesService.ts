import { logger } from "../helpers/logger";
import communityUploadsModel from "../MongoModels/communityUploadsModel";

// Definir tipos para movieDetails y user si es posible
export async function createCommunityMovie(movieDetails: any, user: { id: string, userName: string }) {
    try {
        const userMovie = await new communityUploadsModel({
            user: {
                userId: user.id,
                userName: user.userName
            },
            movieDetails
        }).save();
        return userMovie;
    } catch (err: any) {
        logger.error(`failed to create new user movie: ${err.message}`);
        throw err;
    }
}

export async function deleteCommunityMovie(_id: string) {
    try {
        await communityUploadsModel.deleteOne({ _id });
        return true;
    } catch (err: any) {
        logger.error(`failed to delete movie: ${err.message}`);
        throw err;
    }
}

export async function getUserUploadsForSingleUser(id: string) {
    try {
        const userMovies = await communityUploadsModel.find({ "user.userId": id });
        return userMovies;
    } catch (err: any) {
        logger.error(`Failed to get movies for a user: ${err.message}`);
        throw err;
    }
}

export async function getAllCommunityMovies() {
    try {
        const movies = await communityUploadsModel.find({});
        return movies;
    } catch (err: any) {
        logger.error(`failed to get community movies: ${err.message}`);
        throw err;
    }
}

export async function updateUserMovie(movieDetails: any) {
    try {
        const updatedMovie = await communityUploadsModel.findOneAndUpdate({ _id: movieDetails._id }, { $set: { ...movieDetails } }, { new: true });
        return updatedMovie;
    } catch (err: any) {
        logger.error(`Failed to update movie: ${err.message}`);
        throw err;
    }
}

export async function getSingleCommunityMovie(movieId: string, userId: string) {
    try {
        const movie = await communityUploadsModel.findOne({ _id: movieId }).lean();
        if (movie && userId !== movie.user.userId) return false;
        return movie;
    } catch (err: any) {
        logger.error(`Failed to get single community movie: ${err.message}`);
        throw err;
    }
}
