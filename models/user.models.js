const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true, // Asegura que todos los correos electrónicos se almacenen en minúsculas
    },
    password: {
        type: String,
        required: true,
    },
    favMovies: [{  // Cambiado a camelCase para seguir la convención de nomenclatura en JS
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }],
}, {
    timestamps: true  // Añade automáticamente `createdAt` y `updatedAt`
});

module.exports = mongoose.model("User", userSchema);
