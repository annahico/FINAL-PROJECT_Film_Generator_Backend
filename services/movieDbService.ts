import { Document } from 'mongoose';
import { logger } from '../helpers/logger';
import CommunityMovie from '../MongoModels/movieModel';
import { MovieGenerationModel } from '../tsModels/movieGenerationModel'; // Importa el tipo

// Tipo para los resultados de getAllDiscussions
interface Discussion extends Document {
    movieId: number;
    // Aquí deberías agregar más propiedades si existen en el modelo
}

interface CommunityMovieDoc extends Document {
    title: string;
    description?: string;
    createdBy: string;
    // Agrega otras propiedades necesarias según el esquema
}

// Exportación de la interfaz
export { MovieGenerationModel };

// Funciones del servicio de base de datos

export const createCommunityMovieFromService = async (movieObj: MovieGenerationModel, currentUser: string): Promise<CommunityMovieDoc> => {
    try {
        const newMovie = new CommunityMovie({ ...movieObj, createdBy: currentUser });
        await newMovie.save();
        return newMovie;
    } catch (err) {
        logger.error(`Failed to create community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const deleteCommunityMovieFromService = async (movieId: string): Promise<CommunityMovieDoc | null> => {
    try {
        const result = await CommunityMovie.findByIdAndDelete(movieId).exec();
        return result; // `result` ya es un documento de tipo `CommunityMovieDoc`
    } catch (err) {
        logger.error(`Failed to delete community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const getAllCommunityMoviesFromService = async (): Promise<CommunityMovieDoc[]> => {
    try {
        const movies = await CommunityMovie.find({}).exec();
        return movies; // `movies` ya es un array de documentos `CommunityMovieDoc`
    } catch (err) {
        logger.error(`Failed to get all community movies: ${(err as Error).message}`);
        throw err;
    }
};

export const getSingleCommunityMovieFromService = async (movieId: string, userId: string): Promise<CommunityMovieDoc | null> => {
    try {
        const movie = await CommunityMovie.findOne({ _id: movieId, createdBy: userId }).exec();
        return movie; // `movie` ya es de tipo `CommunityMovieDoc | null`
    } catch (err) {
        logger.error(`Failed to get single community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const getUserUploadsForSingleUserFromService = async (userId: string): Promise<CommunityMovieDoc[]> => {
    try {
        const movies = await CommunityMovie.find({ createdBy: userId }).exec();
        return movies; // `movies` ya es un array de documentos `CommunityMovieDoc`
    } catch (err) {
        logger.error(`Failed to get user uploads for single user: ${(err as Error).message}`);
        throw err;
    }
};

export const updateUserMovieFromService = async (movieDetails: MovieGenerationModel): Promise<CommunityMovieDoc | null> => {
    try {
        const updatedMovie = await CommunityMovie.findByIdAndUpdate(movieDetails._id, movieDetails, { new: true }).exec();
        return updatedMovie; // `updatedMovie` ya es de tipo `CommunityMovieDoc | null`
    } catch (err) {
        logger.error(`Failed to update user movie: ${(err as Error).message}`);
        throw err;
    }
};
