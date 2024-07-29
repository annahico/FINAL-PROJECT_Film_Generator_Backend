import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import winston from 'winston';

// Cargar variables de entorno
dotenv.config();

// Inicializar MovieDb con la clave API desde las variables de entorno
const moviedb = new MovieDb(process.env.TMDB_API_KEY); // Asegúrate de usar la clave API correcta

// Configuración de Winston para logging
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ],
});

export const movies = async () => {
    try {
        // Obtén la lista de películas con los géneros especificados
        const movieData = await moviedb.discoverMovie({
            with_genres: '28,53', // Acción y Thriller
        });
        return movieData;
    } catch (err) {
        // Maneja y registra el error
        logger.error('Error al obtener películas:', err);
        throw new Error('Error al obtener películas'); // Proporciona un mensaje de error más informativo
    }
};
