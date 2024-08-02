const mongoose = require('mongoose');
const { MongoDB_URL } = require('../utils/dotenvVariables');

exports.connect = () => {
    mongoose.connect(MongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to the database successfully");
        })
        .catch((error) => {
            console.error("Database connection error:", error.message);
            process.exit(1);
        });
};
