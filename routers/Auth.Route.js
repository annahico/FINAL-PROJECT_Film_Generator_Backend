// Import the required modules
const express = require("express");
const router = express.Router();

const { signUp, login } = require("../controllers/Auth");
const { validateSchema, signUPSchema, LoginSchema } = require("../utils/userSchema");

// Route for user sign-up with schema validation middleware
router.post('/signup', validateSchema(signUPSchema), signUp);

// Route for user login with schema validation middleware
router.post('/login', validateSchema(LoginSchema), login);

module.exports = router;
