const Movie = require("../models/movies.models");
const User = require('../models/user.models');
const mongoose = require('mongoose');
const Comment = require("../models/comment.models");

// Obtener todas las películas con comentarios y usuarios relacionados
exports.getMovie = async (req, res) => {
    try {
        const allMovies = await Movie.find()
            .populate({
                path: 'commentIds',
                populate: {
                    path: 'userId',
                    select: '-_id name'
                }
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Films retrieved successfully.",
            allMovies
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching films."
        });
    }
};

// Agregar una película a los favoritos de un usuario
exports.setMovieFav = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Film not found."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.FavMovie.includes(movieId)) {
            return res.status(400).json({
                success: false,
                message: "Film is already in favorites."
            });
        }

        user.FavMovie.push(movieId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Film added to favorites successfully.",
            favMovies: user.FavMovie
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while setting the favorite film."
        });
    }
};

// Remover una película de los favoritos de un usuario
exports.removeFavMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const movieObjectId = new mongoose.Types.ObjectId(movieId);
        if (!user.FavMovie.some(id => id.equals(movieObjectId))) {
            return res.status(400).json({
                success: false,
                message: "Film is not in favorites."
            });
        }

        user.FavMovie = user.FavMovie.filter(id => !id.equals(movieObjectId));
        await user.save();

        const updatedUser = await User.findById(userId).populate('FavMovie');

        return res.status(200).json({
            success: true,
            message: "Film removed from favorites successfully.",
            favMovies: updatedUser.FavMovie
        });
    } catch (error) {
        console.error("Error removing favorite film:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing the favorite film."
        });
    }
};

// Obtener las películas favoritas de un usuario
exports.getUserFavMovies = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'FavMovie',
            populate: {
                path: 'commentIds',
                populate: {
                    path: 'userId',
                    select: '-_id name'
                }
            }
        }).exec();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const favMovies = user.FavMovie;

        if (!favMovies || favMovies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No favorite films found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Favorite films retrieved successfully.",
            favMovies
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving favorite films."
        });
    }
};

// Agregar un comentario a una película
exports.addComment = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;
        const { text, rating } = req.body;

        if (!text || !rating) {
            return res.status(400).json({
                success: false,
                message: "Comment and rating are both required."
            });
        }

        const newComment = await Comment.create({
            text,
            rating,
            userId
        });

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Film not found."
            });
        }

        movie.commentIds.push(newComment._id);
        await movie.save();

        return res.status(201).json({
            success: true,
            message: "Comment successfully created.",
            comment: newComment
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding the comment."
        });
    }
};
