"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnMovies = returnMovies;
/* eslint-disable */
var dotenv_1 = __importDefault(require("dotenv"));
var moviedb_promise_1 = require("moviedb-promise");
var endpoints_config_1 = __importDefault(require("../endpoints.config"));
var logger_1 = require("../helpers/logger");
dotenv_1.default.config();
var TMDB_API_KEY = process.env.TMDB3 || endpoints_config_1.default.TMDB3;
var moviedb = new moviedb_promise_1.MovieDb(TMDB_API_KEY);
/**
 * @Desc function returns list of movies from api
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 */
function getMovies(movieSearchCriteria) {
    return __awaiter(this, void 0, void 0, function () {
        var movies, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, moviedb.discoverMovie(movieSearchCriteria)];
                case 1:
                    movies = _a.sent();
                    return [2 /*return*/, movies.results];
                case 2:
                    err_1 = _a.sent();
                    logger_1.logger.error("".concat(err_1, " in getting Movies"));
                    throw new Error();
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * @desc function filters the movies
 * @param {any} allMovies JSON from api with list of movies
 * @param {movieSearchCriteriaModel} movieSearchCriteria object of the user input
 */
function filterMovies(allMovies, movieSearchCriteria) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredMovies, movieReturnObj, _i, filteredMovies_1, movie, newMovieObj;
        return __generator(this, function (_a) {
            filteredMovies = [];
            console.log(allMovies);
            try {
                filteredMovies = allMovies.filter(function (movie, index) { return index <= 10; });
            }
            catch (err) {
                logger_1.logger.error("Error in filtering movies ".concat(err));
                throw new Error();
            }
            movieReturnObj = {
                movieGenerationDate: new Date().toISOString(),
                movieSearchCriteria: movieSearchCriteria,
                movies: [],
            };
            try {
                for (_i = 0, filteredMovies_1 = filteredMovies; _i < filteredMovies_1.length; _i++) {
                    movie = filteredMovies_1[_i];
                    newMovieObj = returnMovieGenerationObject();
                    newMovieObj.movieId = movie.id;
                    newMovieObj.movieTitle = movie.title;
                    newMovieObj.movieDescription = movie.overview;
                    newMovieObj.movieReleaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
                    // TODO will have to make a dictionary with genres so they can be properly returned
                    newMovieObj.movieGenres = movie.genre_ids;
                    newMovieObj.moviePopularity = movie.popularity;
                    movieReturnObj.movies.push(newMovieObj);
                }
                return [2 /*return*/, movieReturnObj];
            }
            catch (err) {
                logger_1.logger.error("Failed to format movies ".concat(err));
                throw new Error();
            }
            return [2 /*return*/];
        });
    });
}
/**
 * @desc place holder for movieGeneration object
 * @return {movieObject} returns a blank movie object
 */
function returnMovieGenerationObject() {
    return {
        movieId: 0,
        movieTitle: '',
        movieDescription: '',
        movieReleaseYear: '', // Ensure this is always a string
        movieGenres: [],
        moviePopularity: 0,
    };
}
/**
 * @Desc returns formatted movies to the api
 */
function returnMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var movieSearchCriteria, movies, filteredMovies, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    movieSearchCriteria = {
                        sort_by: 'popularity.desc',
                        with_genres: '28,53',
                        primary_release_year: 2015,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, getMovies(movieSearchCriteria)];
                case 2:
                    movies = _a.sent();
                    return [4 /*yield*/, filterMovies(movies, movieSearchCriteria)];
                case 3:
                    filteredMovies = _a.sent();
                    return [2 /*return*/, filteredMovies];
                case 4:
                    err_2 = _a.sent();
                    logger_1.logger.error("Failed to return movies ".concat(err_2));
                    throw new Error();
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=filterMovies.js.map