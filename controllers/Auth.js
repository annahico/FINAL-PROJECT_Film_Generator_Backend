const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar si todos los campos están presentes
        if (!name || !email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            message: 'Account successfully created',
        });

    } catch (error) {
        console.error(`Error during sign-up: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during sign-up. Please try again later.',
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar si todos los campos están presentes
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Verificar si el usuario existe
        const user = await User.findOne({ email }).populate("FavMovie").exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist. Please sign up first.',
            });
        }

        // Verificar la contraseña y generar el token JWT
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const payload = {
                email: user.email,
                id: user._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
            });

            // Configurar la cookie y responder al cliente
            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
                httpOnly: true,
            };

            res.cookie("token", token, cookieOptions).status(200).json({
                success: true,
                token,
                user,
                message: 'User login successful',
            });

        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }

    } catch (error) {
        console.error(`Error during login: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.',
        });
    }
};
