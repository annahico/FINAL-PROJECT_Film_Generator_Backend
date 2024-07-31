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
exports.updateSingleComment = updateSingleComment;
exports.addComment = addComment;
exports.getCommentsForPost = getCommentsForPost;
exports.deleteComment = deleteComment;
exports.setScore = setScore;
var logger_1 = require("../helpers/logger");
var discussionDbService_1 = require("../services/discussionDbService");
var commentModels_1 = __importDefault(require("../tsModels/commentModels"));
function updateSingleComment(_id, commentText) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!_id || !commentText) {
                return [2 /*return*/, false];
            }
            commentModels_1.default.updateOne({ _id: _id }, { $set: { commentText: commentText } })
                .then(function (commentWrote) { return true; })
                .catch(function (err) {
                logger_1.logger.error("Failed to update comment: ".concat(err.message));
                throw err;
            });
            return [2 /*return*/];
        });
    });
}
function addComment(commentData) {
    return __awaiter(this, void 0, void 0, function () {
        var commentObj;
        return __generator(this, function (_a) {
            try {
                commentObj = {
                    movieId: commentData.movieId,
                    user: {
                        userId: commentData.id,
                        userName: commentData.userName
                    },
                    commentText: commentData.commentText,
                    commentDownVotes: 0,
                    commentUpVotes: 0,
                    isDeleted: false
                };
                commentObj.depth = (commentData.depth) ? commentData.depth : 1;
                commentObj.parentId = (commentData.parentId) ? commentData.parentId : null;
                new commentModels_1.default(commentObj).save()
                    .then(function (comment) { return comment; })
                    .catch(function (err) {
                    logger_1.logger.error("Failed to add comment: ".concat(err.message));
                    throw err;
                });
            }
            catch (err) {
                logger_1.logger.error("Failed to add comment: ".concat(err.message));
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
function getCommentsForPost(movie) {
    return __awaiter(this, void 0, void 0, function () {
        var isDiscussion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, discussionDbService_1.checkIfDiscussionExists)(movie.movieId)
                        .then(function (bool) { return bool; })
                        .catch(function (err) {
                        logger_1.logger.error("Failed to check if discussion exists: ".concat(err.message));
                        throw err;
                    })];
                case 1:
                    isDiscussion = _a.sent();
                    if (!isDiscussion) {
                        (0, discussionDbService_1.createDiscussion)(movie)
                            .then(function (discussion) { return discussion; })
                            .catch(function (err) {
                            logger_1.logger.error("Failed to create discussion: ".concat(err.message));
                            throw err;
                        });
                    }
                    return [4 /*yield*/, commentModels_1.default.find({ movieId: movie.movieId }).lean().exec()
                            .then(function (commentsForMovie) {
                            var rec = function (comment, threads) {
                                for (var thread in threads) {
                                    var value = threads[thread];
                                    if (thread.toString() === comment.parentId.toString()) {
                                        value.children[comment._id] = comment;
                                        return;
                                    }
                                    if (value.children) {
                                        rec(comment, value.children);
                                    }
                                }
                            };
                            var threads = {};
                            var comment;
                            for (var q = 0; q < commentsForMovie.length; q++) {
                                comment = commentsForMovie[q];
                                comment['children'] = {};
                                var parentId = comment.parentId;
                                if (!parentId) {
                                    threads[comment._id] = comment;
                                    continue;
                                }
                                rec(comment, threads);
                            }
                            return {
                                count: commentsForMovie.length,
                                comments: threads
                            };
                        })
                            .catch(function (err) {
                            logger_1.logger.error("Failed to get comments for movie ".concat(movie.movieId, ": ").concat(err.message));
                            throw err;
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function deleteComment(_id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            commentModels_1.default.findOneAndUpdate({ _id: _id }, { $set: { commentText: 'This comment has been delete', 'user.userId': null, 'user.userName': 'Unknown', isDeleted: true } })
                .then(function (result) { return result; })
                .catch(function (err) {
                logger_1.logger.error("failed to delete user: ".concat(err.message));
                throw err;
            });
            return [2 /*return*/];
        });
    });
}
function setScore(_id, commentScore) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            commentModels_1.default.findOneAndUpdate({ _id: _id }, { $set: { commentScore: commentScore } })
                .then(function (newScore) {
                return newScore;
            })
                .catch(function (err) {
                logger_1.logger.error("failed to increase score: ".concat(err.message));
                throw err;
            });
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=commentService.js.map