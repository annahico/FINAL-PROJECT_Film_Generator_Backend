const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Ratings sub-schema
const ratingsSchema = new Schema({
    Metascore: { type: String },
    imdbRating: { type: String },
    imdbVotes: { type: String },
    imdbID: { type: String },
    Type: { type: String },
    DVD: { type: String },
    BoxOffice: { type: String },
    Production: { type: String },
    Website: { type: String }
}, { _id: false });

// Define the Movie schema
const movieSchema = new Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    rated: { type: String },
    released: { type: String },
    runtime: { type: String },
    genre: { type: String },
    director: { type: String },
    writer: { type: String },
    actors: { type: String },
    plot: { type: String },
    language: { type: String },
    country: { type: String },
    awards: { type: String },
    poster: { type: String },
    commentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }],
    ratings: ratingsSchema
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
