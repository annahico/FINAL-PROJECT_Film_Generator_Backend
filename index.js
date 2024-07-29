const cors = require('cors');
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('🚀 Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// Crear la aplicación Express
const app = express();

// Configurar el puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(` 🚀 Server is running on port ${port}`);
});
