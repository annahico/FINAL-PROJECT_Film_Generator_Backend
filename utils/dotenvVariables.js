// Load environment variables from a .env file
require('dotenv').config();

const MongoDB_URL = process.env.MongoDB_URL;
const PORT = process.env.PORT || 5000;
const por = "annahico"; // This is a constant string, not an environment variable

module.exports = {
    MongoDB_URL,
    PORT,
    por
};
