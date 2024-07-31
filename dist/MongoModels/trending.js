"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
// Define el esquema para la colección de "Trending"
var TrendingSchema = new mongoose_1.Schema({
    movieGenerationDate: {
        type: String,
        required: true,
    },
    movieSearchCriteria: {
        sort_by: {
            type: String,
            required: false,
        },
        with_genres: {
            type: String,
            required: false,
        },
        primary_release_year: {
            type: String,
            required: false,
        },
        with_keywords: {
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
            movieImagePath: {
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
                type: String,
                required: true,
            },
            moviePopularity: {
                type: String,
                required: false,
            },
        },
    ],
});
// Exporta el modelo basado en el esquema
exports.default = mongoose_1.default.model("Trending", TrendingSchema);
//# sourceMappingURL=trending.js.map