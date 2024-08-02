// Load environment variables from a .env file
require('dotenv').config();

const MongoDB_URL = process.env.MongoDB_URL;
const PORT = process.env.PORT || 5000;
const por = "prabhat"; // This is a constant string, not an environment variable

module.exports = {
    MongoDB_URL,
    PORT,
    por
};
