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
exports.updateUserMovie = exports.getUserUploadsForSingleUser = exports.getSingleCommunityMovie = exports.getMovie = exports.getAllDiscussions = exports.getAllCommunityMovies = exports.deleteCommunityMovie = exports.createCommunityMovie = void 0;
exports.updateSingleComment = updateSingleComment;
exports.addComment = addComment;
exports.getCommentsForPost = getCommentsForPost;
exports.deleteComment = deleteComment;
exports.setScore = setScore;
var commentModel_1 = __importDefault(require("../MongoModels/commentModel"));
var logger_1 = require("../helpers/logger");
var discussionDbService_1 = require("../services/discussionDbService");
// Importar funciones del servicio de base de datos de películas
var movieDbService_1 = require("../services/movieDbService");
function updateSingleComment(_id, commentText) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!_id || !commentText) {
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, commentModel_1.default.updateOne({ _id: _id }, { $set: { commentText: commentText } }).exec()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.modifiedCount > 0];
                case 3:
                    err_1 = _a.sent();
                    logger_1.logger.error("Failed to update comment: ".concat(err_1.message));
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addComment(commentData) {
    return __awaiter(this, void 0, void 0, function () {
        var commentObj, savedComment, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    commentObj = {
                        movieId: commentData.movieId,
                        user: {
                            userId: commentData.id,
                            userName: commentData.userName
                        },
                        commentText: commentData.commentText,
                        commentDownVotes: [],
                        commentUpVotes: [],
                        isDeleted: false,
                        depth: commentData.depth || 1,
                        parentId: commentData.parentId || null
                    };
                    return [4 /*yield*/, new commentModel_1.default(commentObj).save()];
                case 1:
                    savedComment = _a.sent();
                    return [2 /*return*/, savedComment.toObject()];
                case 2:
                    err_2 = _a.sent();
                    logger_1.logger.error("Failed to add comment: ".concat(err_2.message));
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCommentsForPost(movie) {
    return __awaiter(this, void 0, void 0, function () {
        var isDiscussion, commentsForMovie, threads_1, filterChildren_1, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, discussionDbService_1.checkIfDiscussionExists)(movie.movieId)];
                case 1:
                    isDiscussion = _a.sent();
                    if (!isDiscussion) {
                        return [2 /*return*/, { count: 0, comments: {} }];
                    }
                    return [4 /*yield*/, commentModel_1.default.find({ movieId: movie.movieId }).lean().exec()];
                case 2:
                    commentsForMovie = _a.sent();
                    threads_1 = {};
                    filterChildren_1 = function (comment, thread) {
                        var _a;
                        for (var key in thread) {
                            var value = thread[key];
                            if (key === ((_a = comment.parentId) === null || _a === void 0 ? void 0 : _a.toString())) {
                                value.children[comment._id] = comment;
                                return;
                            }
                            if (value.children) {
                                filterChildren_1(comment, value.children);
                            }
                        }
                    };
                    commentsForMovie.forEach(function (comment) {
                        if (comment.commentScore < -5)
                            comment.commentText = "This comment is hidden due to low scoring";
                        comment['children'] = {};
                        if (!comment.parentId) {
                            threads_1[comment._id] = comment;
                        }
                        else {
                            filterChildren_1(comment, threads_1);
                        }
                    });
                    return [2 /*return*/, { count: commentsForMovie.length, comments: threads_1 }];
                case 3:
                    err_3 = _a.sent();
                    logger_1.logger.error("Failed to get comments for movie ".concat(movie.movieId, ": ").concat(err_3.message));
                    throw err_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteComment(_id) {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, commentModel_1.default.findOneAndUpdate({ _id: _id }, { $set: { commentText: 'This comment has been deleted', 'user.userId': null, 'user.userName': 'Unknown', isDeleted: true } }, { new: true }).exec()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_4 = _a.sent();
                    logger_1.logger.error("Failed to delete comment: ".concat(err_4.message));
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setScore(_id, commentScore, value, userId, changedFromUpVote, changedFromDownVote) {
    return __awaiter(this, void 0, void 0, function () {
        var scoreType, err_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    if (!changedFromDownVote) return [3 /*break*/, 2];
                    return [4 /*yield*/, commentModel_1.default.findByIdAndUpdate(_id, { $set: { commentScore: commentScore }, $pull: { commentDownVotes: userId } }, { new: true }).exec()];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    if (!changedFromUpVote) return [3 /*break*/, 4];
                    return [4 /*yield*/, commentModel_1.default.findByIdAndUpdate(_id, { $set: { commentScore: commentScore }, $pull: { commentUpVotes: userId } }, { new: true }).exec()];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    scoreType = (value === 1) ? 'commentUpVotes' : 'commentDownVotes';
                    return [4 /*yield*/, commentModel_1.default.findByIdAndUpdate(_id, { $set: { commentScore: commentScore }, $push: (_a = {}, _a[scoreType] = userId, _a) }, { new: true }).exec()];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    err_5 = _b.sent();
                    logger_1.logger.error("Failed to update comment score: ".concat(err_5.message));
                    throw err_5;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Exportar funciones del servicio de base de datos de películas
exports.createCommunityMovie = movieDbService_1.createCommunityMovie;
exports.deleteCommunityMovie = movieDbService_1.deleteCommunityMovie;
exports.getAllCommunityMovies = movieDbService_1.getAllCommunityMovies;
exports.getAllDiscussions = movieDbService_1.getAllDiscussions;
exports.getMovie = movieDbService_1.getMovie;
exports.getSingleCommunityMovie = movieDbService_1.getSingleCommunityMovie;
exports.getUserUploadsForSingleUser = movieDbService_1.getUserUploadsForSingleUser;
exports.updateUserMovie = movieDbService_1.updateUserMovie;
//# sourceMappingURL=commentService.js.map