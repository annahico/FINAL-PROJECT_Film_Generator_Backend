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
var express_1 = __importDefault(require("express"));
var logger_1 = require("../helpers/logger");
var auth_1 = require("../middleware/auth");
var commentService_1 = require("../services/commentService");
var discoverMoviesService_1 = require("../services/discoverMoviesService");
var movieDbService_1 = require("../services/movieDbService");
// eslint-disable-next-line new-cap
var router = express_1.default.Router();
/**
 * @Route /api/movies/movieGeneration
 * @Desc Retrieve user input and filter movies
 */
router.post('/movieGeneration', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, formattedMovies, err_1, isRevised, returnObj, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id = req.body.user ? req.body.user.id : null;
                return [4 /*yield*/, (0, discoverMoviesService_1.returnMovies)(req.body.MovieGenerationModel)];
            case 1:
                formattedMovies = _a.sent();
                if (!id) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, movieDbService_1.writeToDatabase)(formattedMovies, id)];
            case 3:
                _a.sent();
                logger_1.logger.info("Movie successfully wrote to DB");
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                logger_1.logger.error("Failed to write movies to DB: ".concat(err_1.message));
                return [2 /*return*/, res.status(500).send('Failed to write movies to DB')];
            case 5:
                isRevised = req.body.MovieGenerationModel !== formattedMovies.movieSearchCriteria;
                returnObj = { formattedMovies: formattedMovies, isRevised: isRevised };
                res.send(JSON.stringify(returnObj));
                return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                logger_1.logger.error("".concat(err_2, " error in API"));
                res.status(404).send('Error getting movies');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/returnMovies
 * @Desc Retrieves all generations for a user
 */
router.post('/returnMovies', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userMovieGenerations, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.user ? req.body.user.id : null;
                if (!id)
                    return [2 /*return*/, res.status(401).send('Please log in to access previous curations')];
                return [4 /*yield*/, (0, movieDbService_1.getMoviesFromDatabase)(id)];
            case 1:
                userMovieGenerations = _a.sent();
                if (userMovieGenerations) {
                    res.status(200).send(userMovieGenerations);
                }
                else {
                    res.status(404).send('Unable to find user movies');
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                logger_1.logger.error(err_3);
                res.status(404).send('Unable to find user movies');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/getPlaylists
 * @Desc Retrieves all user playlists from database
 */
router.post('/getPlaylists', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, playlists, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.user ? req.body.user.id : null;
                if (!id)
                    return [2 /*return*/, res.status(401).send('Please log in to see your playlists')];
                return [4 /*yield*/, (0, movieDbService_1.getPlaylistsFromDatabase)(id)];
            case 1:
                playlists = _a.sent();
                res.send(JSON.stringify(playlists));
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                logger_1.logger.error("Failed to get playlists ".concat(err_4.message));
                res.status(404).send('Failed to get user playlists from database');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/addComments
 * @Desc Adds a comment to the database
 */
router.post('/comments/addComments', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentAdded, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.addComment)(req.body)];
            case 1:
                commentAdded = _a.sent();
                res.send(commentAdded);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                logger_1.logger.error("Failed to add comment: ".concat(err_5.message));
                res.status(500).send('Sorry, but your comment could not be added right now, please try again later');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/getComments
 * @param postId: ID of post to query in DB
 * @Desc Retrieves comments for a specific post
 */
router.get('/comments/getComments/:postId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.getCommentsForPost)(req.params.postId)];
            case 1:
                comments = _a.sent();
                res.send(comments);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                logger_1.logger.error("Failed to get comments: ".concat(err_6.message));
                res.status(500).send('Failed to get comments for this post');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/update
 * @Desc Updates a comment in the database
 */
router.post('/comments/update', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, commentText, commentId, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, commentText = _a.commentText, commentId = _a.commentId;
                return [4 /*yield*/, (0, commentService_1.updateSingleComment)({ id: commentId, commentText: commentText })];
            case 1:
                _b.sent();
                res.send('Comment updated successfully');
                return [3 /*break*/, 3];
            case 2:
                err_7 = _b.sent();
                logger_1.logger.error("Failed to update comment: ".concat(err_7.message));
                res.status(500).send('Failed to update comment');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/delete/:commentId
 * @Desc Deletes a comment from the database
 */
router.get('/comments/delete/:commentId', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.deleteComment)(req.params.commentId)];
            case 1:
                result = _a.sent();
                res.send(result);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                logger_1.logger.error("Failed to delete comment: ".concat(err_8.message));
                res.status(500).send('Failed to delete comment, try again later');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/increase/score/:commentId/:commentScore
 * @Desc Increases the score of a comment
 */
router.get('/comments/increase/score/:commentId/:commentScore', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.setUpvotes)(req.params.commentId, parseInt(req.params.commentScore, 10))];
            case 1:
                comment = _a.sent();
                res.send(comment);
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                logger_1.logger.error("Failed to increase comment score: ".concat(err_9.message));
                res.status(500).send('Failed to increase score');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @Route /api/movies/comments/decrease/score/:commentId/:commentScore
 * @Desc Decreases the score of a comment
 */
router.get('/comments/decrease/score/:commentId/:commentScore', auth_1.movieAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, commentService_1.setDownvotes)(req.params.commentId, parseInt(req.params.commentScore, 10))];
            case 1:
                comment = _a.sent();
                res.send(comment);
                return [3 /*break*/, 3];
            case 2:
                err_10 = _a.sent();
                logger_1.logger.error("Failed to decrease comment score: ".concat(err_10.message));
                res.status(500).send('Failed to decrease score');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Export router
exports.default = router;
//# sourceMappingURL=moviesAPI.js.map