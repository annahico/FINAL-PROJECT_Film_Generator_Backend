import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import UserSchema from '../../models/User';

dotenv.config(); // Asegúrate de cargar las variables de entorno

const router = express.Router();
const saltRounds = 10; // Número de rondas para encriptar contraseñas

// Ruta de prueba para verificar que la API está funcionando
router.get('/test', (req, res) => {
    res.status(200).send('API is working');
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validación básica
        if (!name || !email || !password) {
            return res.status(400).send('Todos los campos son requeridos');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new UserSchema({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(201).json(user); // Enviar datos JSON con estado 201 (Creado)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
            return res.status(400).send('Email y contraseña son requeridos');
        }

        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(404).send('No se encontró el usuario');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Contraseña incorrecta');
        }

        // Opcional: generar un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

export default router;
