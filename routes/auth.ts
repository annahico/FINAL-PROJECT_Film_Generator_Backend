import bcrypt from 'bcryptjs';
import config from 'config';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserSchema from '../MongoModels/userModel';
import { logger } from '../helpers/logger';

const router = express.Router();

// Define una interfaz para el cuerpo de la solicitud
interface LoginRequestBody {
    email: string;
    password: string;
}

interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}

// @route POST /login
router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(400).send('This email does not exist');
        }

        // Validar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid Credentials');
        }

        // Firmar el JWT
        const token = jwt.sign(
            { id: user._id },
            config.get<string>('jwtSecret'),
            { expiresIn: '6h' } // Token expira en 6 horas
        );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        logger.error(`Login error: ${(err as Error).message}`);
        res.status(500).send('Server error');
    }
});

// @route POST /register
router.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Please enter all fields');
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(409).send('This email is already registered');
        }

        // Crear un nuevo usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserSchema({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Firmar el JWT
        const token = jwt.sign(
            { id: savedUser._id },
            config.get<string>('jwtSecret'),
            { expiresIn: '6h' }
        );

        res.json({
            token,
            user: {
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (err) {
        logger.error(`Registration error: ${(err as Error).message}`);
        res.status(500).send('Server error');
    }
});

export default router;
