import { Document } from 'mongoose';
import { logger } from '../helpers/logger';
import CommunityMovie from '../MongoModels/movieModel';
import { MovieGenerationModel } from '../tsModels/movieGenerationModel';

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
        return newMovie as unknown as CommunityMovieDoc;
    } catch (err) {
        logger.error(`Failed to create community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const deleteCommunityMovieFromService = async (movieId: string): Promise<CommunityMovieDoc | null> => {
    try {
        const result = await CommunityMovie.findByIdAndDelete(movieId).exec();
        return result as CommunityMovieDoc | null;
    } catch (err) {
        logger.error(`Failed to delete community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const getAllCommunityMoviesFromService = async (): Promise<CommunityMovieDoc[]> => {
    try {
        const movies = await CommunityMovie.find({}).exec();
        return movies as unknown as CommunityMovieDoc[];
    } catch (err) {
        logger.error(`Failed to get all community movies: ${(err as Error).message}`);
        throw err;
    }
};

export const getSingleCommunityMovieFromService = async (movieId: string, userId: string): Promise<CommunityMovieDoc | null> => {
    try {
        const movie = await CommunityMovie.findOne({ _id: movieId, createdBy: userId }).exec();
        return movie as CommunityMovieDoc | null;
    } catch (err) {
        logger.error(`Failed to get single community movie: ${(err as Error).message}`);
        throw err;
    }
};

export const getUserUploadsForSingleUserFromService = async (userId: string): Promise<CommunityMovieDoc[]> => {
    try {
        const movies = await CommunityMovie.find({ createdBy: userId }).exec();
        return movies as unknown as CommunityMovieDoc[];
    } catch (err) {
        logger.error(`Failed to get user uploads for single user: ${(err as Error).message}`);
        throw err;
    }
};

export const updateUserMovieFromService = async (movieDetails: MovieGenerationModel): Promise<CommunityMovieDoc | null> => {
    try {
        const existingMovie = await CommunityMovie.findById(movieDetails._id).exec();

        if (!existingMovie) {
            return null; 
        }

        const updatedDetails = { ...existingMovie.toObject(), ...movieDetails };

        existingMovie.set(updatedDetails);

        const updatedMovie = await existingMovie.save();
        return updatedMovie as unknown as CommunityMovieDoc;
    } catch (err) {
        logger.error(`Failed to update user movie: ${(err as Error).message}`);
        throw err;
    }
};

export const getAllDiscussionsFromService = async (): Promise<Discussion[]> => {
    try {
        const discussions = await CommunityMovie.find({}).exec();
        return discussions as unknown as Discussion[];
    } catch (err) {
        logger.error(`Failed to get all discussions: ${(err as Error).message}`);
        throw err;
    }
};

export const getMovieFromService = async (movieId: string): Promise<CommunityMovieDoc | null> => {
    try {
        const movie = await CommunityMovie.findById(movieId).exec();
        return movie as CommunityMovieDoc | null;
    } catch (err) {
        logger.error(`Failed to get movie: ${(err as Error).message}`);
        throw err;
    }
};

// Nuevas funciones para getMoviesFromDatabase, getPlaylistsFromDatabase, getSingleGeneration y writeToDatabase

export const getMoviesFromDatabase = async (id: string): Promise<MovieGenerationModel[]> => {
    try {
        const movies = await CommunityMovie.find({}).exec();
        return movies as unknown as MovieGenerationModel[]; 
    } catch (err) {
        logger.error(`Failed to get movies from database: ${(err as Error).message}`);
        throw err;
    }
};

export const getPlaylistsFromDatabase = async (id?: string): Promise<any[]> => {
    try {
        // Lógica para obtener las listas de reproducción
        return []; // Ajusta esto según el esquema y el modelo
    } catch (err) {
        logger.error(`Failed to get playlists from database: ${(err as Error).message}`);
        throw err;
    }
};

export const getSingleGeneration = async (generationId: string): Promise<MovieGenerationModel | null> => {
    try {
        const generation = await CommunityMovie.findById(generationId).exec();
        return generation as unknown as MovieGenerationModel; 
    } catch (err) {
        logger.error(`Failed to get single generation: ${(err as Error).message}`);
        throw err;
    }
};

export const writeToDatabase = async (data: MovieGenerationModel, id: any): Promise<void> => {
    try {
        const newEntry = new CommunityMovie(data);
        await newEntry.save();
    } catch (err) {
        logger.error(`Failed to write to database: ${(err as Error).message}`);
        throw err;
    }
};

