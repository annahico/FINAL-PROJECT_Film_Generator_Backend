// Cargar el módulo dotenv para manejar las variables de entorno
import 'dotenv/config';

// Importar el módulo moviedb-promise
import MovieDb from 'moviedb-promise';

// Crear una instancia de MovieDb con la clave API
const apiKey = process.env.API_KEY; // Asegúrate de tener tu clave API en el archivo .env
const moviedb = new MovieDb(apiKey);

// Definir tipos para las respuestas
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

// Función para obtener y mostrar las películas populares
function getPopularMovies() {
    moviedb.moviePopular()
        .then((response: MovieResponse) => {
            console.log('Películas Populares:');
            response.results.forEach((movie: Movie) => {
                console.log(`${movie.title} (ID: ${movie.id})`);
            });
        })
        .catch((error: any) => {
            console.error('Error al obtener películas populares:', error);
        });
}

// Función para buscar una película por título
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
        .catch((error: any) => {
            console.error('Error al buscar película:', error);
        });
}

// Función para obtener detalles de una película específica
function getMovieDetails(movieId: number) {
    moviedb.movieInfo({ id: movieId })
        .then((response: Movie) => {
            console.log('Detalles de la Película:');
            console.log(`Título: ${response.title}`);
            console.log(`Sinopsis: ${response.overview}`);
            console.log(`Fecha de Estreno: ${response.release_date}`);
            console.log(`Promedio de Votos: ${response.vote_average}`);
        })
        .catch((error: any) => {
            console.error('Error al obtener detalles de la película:', error);
        });
}

// Ejemplo de uso
getPopularMovies(); // Muestra las películas populares

// Busca una película por título
searchMovieByTitle('Deadpool');

// Obtén detalles de una película específica (reemplaza '123' con el ID real de una película)
getMovieDetails(123);
