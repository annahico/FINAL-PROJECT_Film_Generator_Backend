"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Define the schema
var MovieSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    userMovies: [{
            movieGenerationDate: { type: String, required: true },
            movieSearchCriteria: {
                region: String,
                sort_by: { type: String, enum: ['popularity.asc', 'popularity.desc', 'release_date.asc', 'release_date.desc', 'revenue.asc', 'revenue.desc', 'primary_release_date.asc', 'primary_release_date.desc', 'original_title.asc', 'original_title.desc', 'vote_average.asc', 'vote_average.desc', 'vote_count.asc', 'vote_count.desc'] },
                certification_country: String,
                certification: String,
                'certification.lte': String,
                'certification.gte': String,
                include_adult: Boolean,
                include_video: Boolean,
                page: Number,
                primary_release_year: Number,
                'primary_release_date.gte': String,
                'primary_release_date.lte': String,
                'release_date.gte': String,
                'release_date.lte': String,
                with_release_type: Number,
                year: Number,
                'vote_count.gte': Number,
                'vote_count.lte': Number,
                'vote_average.gte': Number,
                'vote_average.lte': Number,
                with_cast: String,
                with_crew: String,
                with_people: String,
                with_companies: String,
                with_genres: String,
                without_genres: String,
                with_keywords: String,
                without_keywords: String,
                'with_runtime.gte': Number,
                'with_runtime.lte': Number,
                with_original_language: String
            },
            movies: [{
                    movieId: Number,
                    movieTitle: String,
                    movieDescription: String,
                    movieReleaseYear: String,
                    movieGenres: [Number],
                    moviePopularity: Number,
                }]
        }]
});
// Create and export the model
exports.default = (0, mongoose_1.model)('Movie', MovieSchema);
//# sourceMappingURL=movieGenerationModel.js.map