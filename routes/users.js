import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken'; // Opcional: para la gestión de tokens JWT
import { logger } from '../../helpers/logger';
import UserSchema from '../../models/User';

const router = express.Router();
const saltRounds = 10; // Número de rondas para encriptar contraseñas

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const newUser = new UserSchema({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(201).send(user);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error al registrar el usuario');
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

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

        res.status(200).send({ user, token });
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error al iniciar sesión');
    }
});

// Ruta para actualizar el usuario
router.post('/update', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await UserSchema.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        if (result.nModified === 0) {
            return res.status(404).send('No se encontró el usuario para actualizar');
        }

        res.status(200).send('Usuario actualizado con éxito');
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Ruta para eliminar un usuario
router.get('/delete/:id', async (req, res) => {
    try {
        const result = await UserSchema.deleteOne({ email: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send('No se encontró el usuario para eliminar');
        }

        res.status(200).send(`${req.params.id} eliminado con éxito`);
    } catch (err) {
        logger.error(err);
        res.status(500).send('Error al eliminar el usuario');
    }
});

export default router;
