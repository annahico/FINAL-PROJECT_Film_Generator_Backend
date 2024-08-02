// movieDbService.ts

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
        return newMovie as unknown as unknown as CommunityMovieDoc;
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

// Modificación aquí
export const updateUserMovieFromService = async (movieDetails: MovieGenerationModel): Promise<CommunityMovieDoc | null> => {
    try {
        // Buscar la película existente primero
        const existingMovie = await CommunityMovie.findById(movieDetails._id).exec();

        if (!existingMovie) {
            return null; // Retornar null si no se encuentra la película
        }

        // Verificar si faltan propiedades en movieDetails y asignarlas desde existingMovie
        const updatedDetails = { ...existingMovie.toObject(), ...movieDetails };

        // Actualizar los campos del documento existente
        existingMovie.set(updatedDetails);

        // Guardar los cambios y retornar el documento actualizado
        const updatedMovie = await existingMovie.save();
        return updatedMovie as unknown as CommunityMovieDoc;
    } catch (err) {
        logger.error(`Failed to update user movie: ${(err as Error).message}`);
        throw err;
    }
};

// Añadir exportaciones adicionales para getAllDiscussionsFromService y getMovieFromService

export const getAllDiscussionsFromService = async (): Promise<Discussion[]> => {
    try {
        // Implementación de ejemplo para obtener todas las discusiones
        const discussions = await CommunityMovie.find({}).exec(); // Esto es solo un ejemplo
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
