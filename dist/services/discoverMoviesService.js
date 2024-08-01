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
exports.writeToDatabase = writeToDatabase;
exports.getMoviesFromDatabase = getMoviesFromDatabase;
exports.getPlaylistsFromDatabase = getPlaylistsFromDatabase;
exports.getSingleGeneration = getSingleGeneration;
var logger_1 = require("../helpers/logger");
var movieModel_1 = __importDefault(require("../MongoModels/movieModel"));
var trending_1 = __importDefault(require("../MongoModels/trending"));
/**
 * Retrieve and format movies based on the provided model.
 * @param {singleGenerationObject} movieGenerationModel - The model used to generate movie recommendations.
 * @returns {Promise<any>} - The formatted movie results.
 */
function returnMovies(movieGenerationModel) {
    return __awaiter(this, void 0, void 0, function () {
        var movies, formattedMovies, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, movieModel_1.default.find({}).lean()];
                case 1:
                    movies = _a.sent();
                    formattedMovies = {
                        movieSearchCriteria: movieGenerationModel, // Assuming this is a search criteria object
                        movies: movies
                    };
                    return [2 /*return*/, formattedMovies];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        logger_1.logger.error("Failed to retrieve movies: ".concat(err_1.message));
                    }
                    else {
                        logger_1.logger.error('Failed to retrieve movies: Unknown error');
                    }
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Write formatted movies to the database.
 * @param {singleGenerationObject} formattedMovies - The formatted movies to save.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<singleGenerationObject>} - The saved movies object.
 */
function writeToDatabase(formattedMovies, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, movieModel_1.default.findOneAndUpdate({ userId: userId }, { $push: { userMovies: formattedMovies } }, { new: true, lean: true })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error('User not found');
                    }
                    return [2 /*return*/, user.userMovies[user.userMovies.length - 1]];
                case 2:
                    err_2 = _a.sent();
                    if (err_2 instanceof Error) {
                        logger_1.logger.error("Failed to write movies to database: ".concat(err_2.message));
                    }
                    else {
                        logger_1.logger.error('Failed to write movies to database: Unknown error');
                    }
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get all generations from the database for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<singleGenerationObject[]>} - The list of movie generations.
 */
function getMoviesFromDatabase(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, movieModel_1.default.findOne({ userId: userId }).lean()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, user ? user.userMovies : []];
                case 2:
                    err_3 = _a.sent();
                    if (err_3 instanceof Error) {
                        logger_1.logger.error("Failed to retrieve movies from database: ".concat(err_3.message));
                    }
                    else {
                        logger_1.logger.error('Failed to retrieve movies from database: Unknown error');
                    }
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get all playlists and trending movies for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - The playlists and trending movies.
 */
function getPlaylistsFromDatabase(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var trendingNow, user, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, trending_1.default.find({}).lean()];
                case 1:
                    trendingNow = _a.sent();
                    return [4 /*yield*/, movieModel_1.default.findOne({ userId: userId }).lean()];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, {
                            userPlaylists: (user === null || user === void 0 ? void 0 : user.userPlaylists) || [],
                            trendingNow: trendingNow[0] || {}
                        }];
                case 3:
                    err_4 = _a.sent();
                    if (err_4 instanceof Error) {
                        logger_1.logger.error("Failed to retrieve playlists and trending movies: ".concat(err_4.message));
                    }
                    else {
                        logger_1.logger.error('Failed to retrieve playlists and trending movies: Unknown error');
                    }
                    throw err_4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get a single generation by its ID.
 * @param {string} generationId - The ID of the generation.
 * @returns {Promise<any>} - The generation object.
 */
function getSingleGeneration(generationId) {
    return __awaiter(this, void 0, void 0, function () {
        var generation, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, movieModel_1.default.findOne({ 'userMovies._id': generationId }).lean()];
                case 1:
                    generation = _a.sent();
                    return [2 /*return*/, generation === null || generation === void 0 ? void 0 : generation.userMovies.find(function (gen) { return gen._id.toString() === generationId; })];
                case 2:
                    err_5 = _a.sent();
                    if (err_5 instanceof Error) {
                        logger_1.logger.error("Failed to get single generation: ".concat(err_5.message));
                    }
                    else {
                        logger_1.logger.error('Failed to get single generation: Unknown error');
                    }
                    throw err_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=discoverMoviesService.js.map