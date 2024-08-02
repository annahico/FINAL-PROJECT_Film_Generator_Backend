"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.updateUserMovieFromService = exports.getUserUploadsForSingleUserFromService = exports.getSingleCommunityMovieFromService = exports.getAllCommunityMoviesFromService = exports.deleteCommunityMovieFromService = exports.createCommunityMovieFromService = void 0;
var logger_1 = require("../helpers/logger");
var movieModel_1 = __importDefault(require("../MongoModels/movieModel"));
// Funciones del servicio de base de datos
var createCommunityMovieFromService = function (movieObj, currentUser) { return __awaiter(void 0, void 0, void 0, function () {
    var newMovie, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newMovie = new movieModel_1.default(__assign(__assign({}, movieObj), { createdBy: currentUser }));
                return [4 /*yield*/, newMovie.save()];
            case 1:
                _a.sent();
                return [2 /*return*/, newMovie];
            case 2:
                err_1 = _a.sent();
                logger_1.logger.error("Failed to create community movie: ".concat(err_1.message));
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCommunityMovieFromService = createCommunityMovieFromService;
var deleteCommunityMovieFromService = function (movieId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, movieModel_1.default.findByIdAndDelete(movieId).exec()];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result]; // `result` ya es un documento de tipo `CommunityMovieDoc`
            case 2:
                err_2 = _a.sent();
                logger_1.logger.error("Failed to delete community movie: ".concat(err_2.message));
                throw err_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCommunityMovieFromService = deleteCommunityMovieFromService;
var getAllCommunityMoviesFromService = function () { return __awaiter(void 0, void 0, void 0, function () {
    var movies, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, movieModel_1.default.find({}).exec()];
            case 1:
                movies = _a.sent();
                return [2 /*return*/, movies]; // `movies` ya es un array de documentos `CommunityMovieDoc`
            case 2:
                err_3 = _a.sent();
                logger_1.logger.error("Failed to get all community movies: ".concat(err_3.message));
                throw err_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllCommunityMoviesFromService = getAllCommunityMoviesFromService;
var getSingleCommunityMovieFromService = function (movieId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var movie, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, movieModel_1.default.findOne({ _id: movieId, createdBy: userId }).exec()];
            case 1:
                movie = _a.sent();
                return [2 /*return*/, movie]; // `movie` ya es de tipo `CommunityMovieDoc | null`
            case 2:
                err_4 = _a.sent();
                logger_1.logger.error("Failed to get single community movie: ".concat(err_4.message));
                throw err_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleCommunityMovieFromService = getSingleCommunityMovieFromService;
var getUserUploadsForSingleUserFromService = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var movies, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, movieModel_1.default.find({ createdBy: userId }).exec()];
            case 1:
                movies = _a.sent();
                return [2 /*return*/, movies]; // `movies` ya es un array de documentos `CommunityMovieDoc`
            case 2:
                err_5 = _a.sent();
                logger_1.logger.error("Failed to get user uploads for single user: ".concat(err_5.message));
                throw err_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserUploadsForSingleUserFromService = getUserUploadsForSingleUserFromService;
var updateUserMovieFromService = function (movieDetails) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedMovie, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, movieModel_1.default.findByIdAndUpdate(movieDetails._id, movieDetails, { new: true }).exec()];
            case 1:
                updatedMovie = _a.sent();
                return [2 /*return*/, updatedMovie]; // `updatedMovie` ya es de tipo `CommunityMovieDoc | null`
            case 2:
                err_6 = _a.sent();
                logger_1.logger.error("Failed to update user movie: ".concat(err_6.message));
                throw err_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserMovieFromService = updateUserMovieFromService;
//# sourceMappingURL=movieDbService.js.map