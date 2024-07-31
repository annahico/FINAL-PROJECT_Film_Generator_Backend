"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var moviedb_promise_1 = __importDefault(require("moviedb-promise"));
var apiKey = process.env.API_KEY || 'YOUR_API_KEY';
var moviedb = new moviedb_promise_1.default(apiKey);
function getPopularMovies() {
    moviedb.moviePopular()
        .then(function (response) {
        console.log('Películas Populares:');
        response.results.forEach(function (movie) {
            console.log("".concat(movie.title, " (ID: ").concat(movie.id, ")"));
        });
    })
        .catch(function (error) {
        if (error instanceof Error) {
            console.error('Error al obtener películas populares:', error.message);
        }
        else {
            console.error('Error desconocido al obtener películas populares.');
        }
    });
}
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
        if (error instanceof Error) {
            console.error('Error al buscar película:', error.message);
        }
        else {
            console.error('Error desconocido al buscar película.');
        }
    });
}
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
        if (error instanceof Error) {
            console.error('Error al obtener detalles de la película:', error.message);
        }
        else {
            console.error('Error desconocido al obtener detalles de la película.');
        }
    });
}
// Ejemplo de uso
getPopularMovies(); // Muestra las películas populares
searchMovieByTitle('Deadpool');
getMovieDetails(123);
//# sourceMappingURL=index.js.map