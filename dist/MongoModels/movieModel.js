"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { movieGenerationModel } from '../tsModels/movieGenerationModel'; 
var Schema = mongoose_1.default.Schema;
var MovieSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    userMovies: [
        {
            movieGenerationDate: {
                type: Date,
                required: true,
            },
            movieSearchCriteria: {
                sort_by: {
                    type: String,
                    required: true,
                },
                with_genres: {
                    type: [String],
                    required: true,
                },
                primary_release_year: {
                    type: String,
                    required: false,
                },
            },
            movies: [
                {
                    movieId: {
                        type: Number,
                        required: true,
                    },
                    movieTitle: {
                        type: String,
                        required: true,
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
                        type: [String],
                        required: true,
                    },
                    moviePopularity: {
                        type: Number,
                        required: false,
                    },
                },
            ],
        },
    ],
});
// Export the schema model correctly
exports.default = mongoose_1.default.model('movies', MovieSchema);
//# sourceMappingURL=movieModel.js.map