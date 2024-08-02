// Import the required modules
const express = require("express");
const router = express.Router();

const {
    getMovie,
    setMovieFav,
    getUserFavMovies,
    removeFavMovie,
    addComment
} = require("../controllers/Movie");

const { auth } = require("../middlewares/auth");
const { validateSchema } = require("../utils/userSchema");
const { commentSchema } = require("../utils/commentSchema");

// Route to set a favorite movie for a user
router.post('/setFavMovies/:movieId', auth, setMovieFav);

// Route to remove a favorite movie for a user
router.post('/removeFavMovies/:movieId', auth, removeFavMovie);

// Route to get all movies
router.get('/allMovies', getMovie);

// Route to get all favorite movies for a user
router.get('/getUserFavMovies', auth, getUserFavMovies);

// Route to add a comment to a movie
router.post('/addComment/:movieId', validateSchema(commentSchema), auth, addComment);

module.exports = router;
