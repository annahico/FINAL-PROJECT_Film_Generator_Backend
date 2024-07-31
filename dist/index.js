"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Cargar el módulo dotenv para manejar las variables de entorno
require("dotenv/config");
// Importar el módulo moviedb-promise
var moviedb_promise_1 = __importDefault(require("moviedb-promise"));
// Crear una instancia de MovieDb con la clave API
var apiKey = process.env.API_KEY; // Asegúrate de tener tu clave API en el archivo .env
var moviedb = new moviedb_promise_1.default(apiKey);
// Función para obtener y mostrar las películas populares
function getPopularMovies() {
    moviedb.moviePopular()
        .then(function (response) {
        console.log('Películas Populares:');
        response.results.forEach(function (movie) {
            console.log("".concat(movie.title, " (ID: ").concat(movie.id, ")"));
        });
    })
        .catch(function (error) {
        console.error('Error al obtener películas populares:', error);
    });
}
// Función para buscar una película por título
function searchMovieByTitle(title) {
    moviedb.movieSearch({ query: title })
        .then(function (response) {
        if (response.results.length > 0) {
            console.log("Resultados para \"".concat(title, "\":"));
            response.results.forEach(function (movie) {
                console.log("".concat(movie.title, " (ID: ").concat(movie.id, ")"));
            });
        }
        else {
            console.log("No se encontraron resultados para \"".concat(title, "\"."));
        }
    })
        .catch(function (error) {
        console.error('Error al buscar película:', error);
    });
}
// Función para obtener detalles de una película específica
function getMovieDetails(movieId) {
    moviedb.movieInfo({ id: movieId })
        .then(function (response) {
        console.log('Detalles de la Película:');
        console.log("T\u00EDtulo: ".concat(response.title));
        console.log("Sinopsis: ".concat(response.overview));
        console.log("Fecha de Estreno: ".concat(response.release_date));
        console.log("Promedio de Votos: ".concat(response.vote_average));
    })
        .catch(function (error) {
        console.error('Error al obtener detalles de la película:', error);
    });
}
// Ejemplo de uso
getPopularMovies(); // Muestra las películas populares
// Busca una película por título
searchMovieByTitle('Deadpool');
// Obtén detalles de una película específica (reemplaza '123' con el ID real de una película)
getMovieDetails(123);
//# sourceMappingURL=index.js.map