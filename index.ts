import 'dotenv/config';
import MovieDb from 'moviedb-promise';

const apiKey = process.env.API_KEY || 'YOUR_API_KEY';
const moviedb = new MovieDb(apiKey);


// Define tipos de respuesta y función
interface Movie {
    title: string;
    id: number;
    overview?: string;
    release_date?: string;
    vote_average?: number;
}

interface MovieResponse {
    results: Movie[];
}

function getPopularMovies() {
    moviedb.moviePopular()
        .then((response: MovieResponse) => {
            console.log('Películas Populares:');
            response.results.forEach((movie: Movie) => {
                console.log(`${movie.title} (ID: ${movie.id})`);
            });
        })
        .catch((error: unknown) => {
            if (error instanceof Error) {
                console.error('Error al obtener películas populares:', error.message);
            } else {
                console.error('Error desconocido al obtener películas populares.');
            }
        });
}

function searchMovieByTitle(title: string) {
    moviedb.movieSearch({ query: title })
        .then((response: MovieResponse) => {
            if (response.results.length > 0) {
                console.log(`Resultados para "${title}":`);
                response.results.forEach((movie: Movie) => {
                    console.log(`${movie.title} (ID: ${movie.id})`);
                });
            } else {
                console.log(`No se encontraron resultados para "${title}".`);
            }
        })
        .catch((error: unknown) => {
            if (error instanceof Error) {
                console.error('Error al buscar película:', error.message);
            } else {
                console.error('Error desconocido al buscar película.');
            }
        });
}

function getMovieDetails(movieId: number) {
    moviedb.movieInfo({ id: movieId })
        .then((response: Movie) => {
            console.log('Detalles de la Película:');
            console.log(`Título: ${response.title}`);
            console.log(`Sinopsis: ${response.overview}`);
            console.log(`Fecha de Estreno: ${response.release_date}`);
            console.log(`Promedio de Votos: ${response.vote_average}`);
        })
        .catch((error: unknown) => {
            if (error instanceof Error) {
                console.error('Error al obtener detalles de la película:', error.message);
            } else {
                console.error('Error desconocido al obtener detalles de la película.');
            }
        });
}

// Ejemplo de uso
getPopularMovies(); // Muestra las películas populares
searchMovieByTitle('Deadpool');
getMovieDetails(123);
