import express, { Request, Response } from 'express';
import UserSchema from '../MongoModels/userModel';
import { logger } from '../helpers/logger';

const router = express.Router();

// @route GET /users
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await UserSchema.find();
        res.json(users);
    } catch (err: unknown) {
        logger.error(`Failed to get users: ${(err as Error).message}`);
        res.status(500).send('Server error');
    }
});
