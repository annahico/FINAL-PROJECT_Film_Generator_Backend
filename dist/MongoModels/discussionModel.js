"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
// Create Schema
var DiscusionScehma = new Schema({
    movieId: {
        type: Number,
        required: true,
    },
    movieTitle: {
        type: String,
        required: true,
    },
    movieImagePath: {
        type: String,
        required: true
    },
    movieDescription: {
        type: String,
        required: true,
    },
    movieReleaseYear: {
        type: String,
        required: false,
    },
    movieGenres: {
        type: String,
        required: true,
    },
    moviePopularity: {
        type: String,
        required: false,
    },
});
exports.default = mongoose_1.default.model('discussions', DiscusionScehma);
//# sourceMappingURL=discussionModel.js.map