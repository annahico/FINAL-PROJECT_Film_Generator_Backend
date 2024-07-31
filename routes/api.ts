import bcrypt from 'bcryptjs';
import config from 'config';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserSchema from '../MongoModels/userModel';
import { logger } from '../helpers/logger';

const router = express.Router();

// @route POST /login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(400).send('This email does not exist');
        }

        // Validate hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid Credentials');
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            config.get<string>('jwtSecret'),
            { expiresIn: 3600 * 6 } // Token expires in 6 hours
        );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        logger.error(err);
        res.status(500).send('Server error');
    }
});

// @route POST /register
router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).send("Please enter all fields");
    }

    try {
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'This user already exists' });
        }

        const newUser = new UserSchema({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { id: savedUser._id },
            config.get<string>('jwtSecret'),
            { expiresIn: 3600 * 6 }
        );

        res.json({
            token,
            user: {
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (err) {
        logger.error(err);
        res.status(500).send('Server error');
    }
});

export default router;
