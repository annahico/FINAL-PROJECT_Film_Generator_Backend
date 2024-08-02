const mongoose = require('mongoose');
const { MongoDB_URL } = require('../utils/dotenvVariables');

exports.connect = () => {
    mongoose.connect(MongoDB_URL)
        .then(() => console.log('Connected to the database successfully'))
        .catch((error) => {
            console.error('Db connection error:', error.message);
            process.exit(1);
        });
};
