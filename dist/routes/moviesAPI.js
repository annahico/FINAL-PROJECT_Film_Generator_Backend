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
var express_1 = __importDefault(require("express"));
var logger_1 = require("../helpers/logger");
var auth_1 = require("../middleware/auth");
var commentService_1 = require("../services/commentService"); // Mantener importaciones como están
var discoverMoviesService_1 = require("../services/discoverMoviesService");
var movieDbService_1 = require("../services/movieDbService");
// eslint-disable-next-line new-cap
var router = express_1.default.Router();
/**
 * @Route /api/movies/movieGeneration
 * @Desc Retrieve user input and filter movies
 */
router.post('/movieGeneration', auth_1.generationAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, formattedMovies, isRevised, dbFormattedMovies, err_1, isRevised, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                id = req.body.user ? req.body.user.id : null;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 7]);
                return [4 /*yield*/, (0, discoverMoviesService_1.returnMovies)(req.body.MovieGenerationModel)];
            case 2:
                formattedMovies = _e.sent();
                isRevised = req.body.MovieGenerationModel !== formattedMovies.movieSearchCriteria;
                if (!id) {
                    res.json(__assign(__assign({}, formattedMovies), { isRevised: isRevised }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, movieDbService_1.writeToDatabase)(formattedMovies, id)];
            case 3:
                dbFormattedMovies = _e.sent();
                res.json(__assign(__assign({}, dbFormattedMovies), { isRevised: isRevised }));
                logger_1.logger.info("Movie successfully written to DB");
                return [3 /*break*/, 7];
            case 4:
                err_1 = _e.sent();
                logger_1.logger.error("Failed to write movies to DB: ".concat(err_1.message));
                _a = req.body.MovieGenerationModel;
                return [4 /*yield*/, (0, discoverMoviesService_1.returnMovies)(req.body.MovieGenerationModel)];
            case 5:
                isRevised = _a !== (_e.sent()).movieSearchCriteria;
                _c = (_b = res).json;
                _d = {};
                return [4 /*yield*/, (0, discoverMoviesService_1.returnMovies)(req.body.MovieGenerationModel)];
            case 6:
                _c.apply(_b, [(_d.formattedMovies = _e.sent(), _d.isRevised = isRevised, _d)]);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/generations/single/:generationId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var generation, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, movieDbService_1.getSingleGeneration)(req.params.generationId)];
            case 1:
                generation = _a.sent();
                res.json(generation);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                logger_1.logger.error("Failed to get single generation: ".concat(err_2.message));
                res.status(500).json({ message: 'Failed to get generation' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieves all generations for a user
 */
router.get('/returnMovies', auth_1.getAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userMovieGenerations, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.token.id;
                if (!id) {
                    return [2 /*return*/, res.status(401).json({ message: "Please log in to access previous curations" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, movieDbService_1.getMoviesFromDatabase)(id)];
            case 2:
                userMovieGenerations = _a.sent();
                if (userMovieGenerations) {
                    res.status(200).json(userMovieGenerations);
                }
                else {
                    res.status(404).json({ message: 'Unable to find user movies' });
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                logger_1.logger.error("Error: ".concat(err_3.message));
                res.status(404).json({ message: 'Unable to find user movies' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/getPlaylists
 * @Desc Retrieves all user playlists from database
 */
router.get('/getPlaylists', auth_1.getAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, playlists, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.token.id;
                if (!id) {
                    return [2 /*return*/, res.status(401).json({ message: "Please log in to see your playlists" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, movieDbService_1.getPlaylistsFromDatabase)(id)];
            case 2:
                playlists = _a.sent();
                res.json(playlists);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.logger.error("Failed to get playlists: ".concat(err_4.message));
                res.status(404).json({ message: 'Failed to get user playlists from database' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/getMovie/:movieId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movie, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getMovie)(req.params.movieId)];
            case 1:
                movie = _a.sent();
                res.json(movie);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                logger_1.logger.error("Failed to get movie from DB: ".concat(err_5.message));
                res.status(404).json({ message: 'Failed to get movie from database' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/discussions/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exists, movie, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, checkIfDiscussionExists(req.body.movieId)];
            case 1:
                exists = _a.sent();
                if (!!exists) return [3 /*break*/, 3];
                return [4 /*yield*/, createDiscussion(req.body)];
            case 2:
                movie = _a.sent();
                res.json(movie);
                return [3 /*break*/, 4];
            case 3:
                res.status(400).json({ message: 'Discussion already exists' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                logger_1.logger.error("Failed to check or create discussion: ".concat(err_6.message));
                res.status(500).json({ message: 'Failed to check or create discussion' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/addComments
 * @Desc Adds a comment to the database
 */
router.post('/comments/addComments', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentAdded, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.addComment)(req.body)];
            case 1:
                commentAdded = _a.sent();
                res.json(commentAdded);
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                logger_1.logger.error("Failed to add comment: ".concat(err_7.message));
                res.status(500).json({ message: 'Sorry, but your comment could not be added right now, please try again later' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/getComments
 * @Desc Retrieves comments for a post
 */
router.post('/comments/getComments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getCommentsForPost)(req.body.movieId)];
            case 1:
                comments = _a.sent();
                res.json(comments);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                logger_1.logger.error("Failed to get comments: ".concat(err_8.message));
                res.status(500).json({ message: 'Failed to get comments for this post' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/update
 * @Desc Updates a single comment
 */
router.post('/comments/update', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, commentText, commentId, updatedComment, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, commentText = _a.commentText, commentId = _a.commentId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.updateSingleComment)(commentId, commentText)];
            case 2:
                updatedComment = _b.sent();
                res.json(updatedComment);
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                logger_1.logger.error("Failed to update comment: ".concat(err_9.message));
                res.status(500).json({ message: 'Failed to update comment' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/delete/commentId
 * @Desc Deletes a comment
 */
router.get('/comments/delete/:commentId/:userId/:commentUserId', auth_1.getAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.params.userId !== req.params.commentUserId) {
                    return [2 /*return*/, res.status(403).json({ message: 'You do not have the authorization to delete this comment' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.deleteComment)(req.params.commentId)];
            case 2:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                logger_1.logger.error("Failed to delete comment: ".concat(err_10.message));
                res.status(500).json({ message: 'Failed to delete comment, try again later' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/score/commentID/commentScore
 * @Desc Sets the score for a comment
 */
router.post('/comments/set/score', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, commentId, commentScore, value, user, changeFromDownVote, changeFromUpvote, comment, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, commentId = _a.commentId, commentScore = _a.commentScore, value = _a.value, user = _a.user, changeFromDownVote = _a.changeFromDownVote, changeFromUpvote = _a.changeFromUpvote;
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Please log in to vote on comments' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.setScore)(commentId, commentScore, value, user.id, changeFromUpvote, changeFromDownVote)];
            case 2:
                comment = _b.sent();
                res.json(comment);
                return [3 /*break*/, 4];
            case 3:
                err_11 = _b.sent();
                logger_1.logger.error("Failed to increase comment score: ".concat(err_11.message));
                res.status(500).json({ message: 'Failed to increase score' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/discussions/getDiscussions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var discussions, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getAllDiscussions)()];
            case 1:
                discussions = _a.sent();
                res.json(discussions);
                return [3 /*break*/, 3];
            case 2:
                err_12 = _a.sent();
                logger_1.logger.error("Failed to get all discussions: ".concat(err_12.message));
                res.status(404).json({ message: 'Failed to get discussions' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/indie/create', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, movieObj, user, currentUser, userMovie, err_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, movieObj = _a.movieObj, user = _a.user, currentUser = _a.currentUser;
                if (!(user === null || user === void 0 ? void 0 : user.id)) {
                    return [2 /*return*/, res.status(401).json({ message: "Please log in to create a post" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.createCommunityMovie)(movieObj, currentUser)];
            case 2:
                userMovie = _b.sent();
                res.status(200).json(userMovie);
                return [3 /*break*/, 4];
            case 3:
                err_13 = _b.sent();
                logger_1.logger.error("Failed to add user movie: ".concat(err_13.message));
                res.status(500).json({ message: 'Failed to add user movie' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/indie/get', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movies, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getAllCommunityMovies)()];
            case 1:
                movies = _a.sent();
                res.json(movies);
                return [3 /*break*/, 3];
            case 2:
                err_14 = _a.sent();
                logger_1.logger.error("Failed to get community movies: ".concat(err_14.message));
                res.status(404).json({ message: 'Failed to get community movies' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/indie/delete/:movieId/:userId/:movieUserId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.params.userId !== req.params.movieUserId) {
                    return [2 /*return*/, res.status(403).json({ message: 'You do not have authorization to delete this movie' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.deleteCommunityMovie)(req.params.movieId)];
            case 2:
                deleted = _a.sent();
                res.json("Movie successfully deleted: ".concat(deleted));
                return [3 /*break*/, 4];
            case 3:
                err_15 = _a.sent();
                logger_1.logger.error("Failed to delete user movie: ".concat(err_15.message));
                res.status(404).json({ message: 'Failed to delete user movie' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/indie/get/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movies, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getUserUploadsForSingleUser)(req.params.userId)];
            case 1:
                movies = _a.sent();
                res.json(movies);
                return [3 /*break*/, 3];
            case 2:
                err_16 = _a.sent();
                logger_1.logger.error("Failed to get community movies for a single user: ".concat(err_16.message));
                res.status(404).json({ message: 'Failed to get user movies for a single user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/indie/delete', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, movieDetails, result, err_17;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, movieDetails = _a.movieDetails;
                if (!user || user.id !== movieDetails.userId) {
                    return [2 /*return*/, res.status(403).json({ message: "You do not have authorization to delete this movie" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.deleteCommunityMovie)(movieDetails.movieId)];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_17 = _b.sent();
                logger_1.logger.error("Failed to delete community movie: ".concat(err_17.message));
                res.status(404).json({ message: 'Failed to delete community movie' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/indie/user/movie/update', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, movieDetails, updatedMovie, err_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, movieDetails = _a.movieDetails;
                if (!user || movieDetails.user.userId !== user.id) {
                    return [2 /*return*/, res.status(403).json({ message: 'You do not have authorization to perform this action' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.updateUserMovie)(movieDetails)];
            case 2:
                updatedMovie = _b.sent();
                res.json(updatedMovie);
                return [3 /*break*/, 4];
            case 3:
                err_18 = _b.sent();
                logger_1.logger.error("Failed to update community movie: ".concat(err_18.message));
                res.status(404).json({ message: 'Failed to update community movie' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/indie/user/single/movie/:movieId', auth_1.getAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, movie, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.token.id;
                if (!id)
                    return [2 /*return*/, res.status(403).json({ message: 'You do not have authorization to update this movie' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, commentService_1.getSingleCommunityMovie)(req.params.movieId, id)];
            case 2:
                movie = _a.sent();
                if (!movie)
                    return [2 /*return*/, res.status(403).json({ message: 'You do not have authorization to update this movie' })];
                res.json(movie);
                return [3 /*break*/, 4];
            case 3:
                err_19 = _a.sent();
                logger_1.logger.error("Failed to get user movie: ".concat(err_19.message));
                res.status(404).json({ message: 'Unable to get user movie' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=moviesAPI.js.map