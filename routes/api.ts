import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserSchema from '../MongoModels/userModel';
import { logger } from '../helpers/logger';

const router = express.Router();

// @route POST /login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserSchema.findOne({ email }).exec();
        if (!user) {
            return res.status(400).send('This email does not exist');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid Credentials');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.jwtSecret || '',
            { expiresIn: '6h' }
        );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (err: unknown) {
        logger.error(`Server error: ${(err as Error).message}`);
        res.status(500).send('Server error');
    }
});
