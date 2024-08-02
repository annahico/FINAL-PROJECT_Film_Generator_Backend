// routes/usersAPI.ts
import express, { Response } from 'express';
import UserSchema from '../MongoModels/userModel';
import { logger } from '../helpers/logger';
import { auth, getAuth } from '../middleware/auth';
import { updateUser } from '../services/userDbService';
import { AuthenticatedRequest } from '../types/custom-types';

const router = express.Router();

// @route GET /user
// @desc Get user info
router.get('/user', getAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.token) {
            return res.status(401).send('No token found');
        }

        const { id } = req.token;
        logger.info(`User info decoded: ${id}`);

        const user = await UserSchema.findById(id).select('-password').exec();
        if (user) {
            logger.info(`User found: ${user}`);
            res.send({
                user: {
                    id: user._id,
                    name: user.name,
                    userName: user.userName,
                    email: user.email
                }
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        logger.error(`Failed to validate user: ${(err as Error).message}`);
        res.status(500).json({ msg: 'Failed to validate user' });
    }
});

// @route POST /update
// @desc Update user profile
router.post('/update', auth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.body.user;
        const userDetails = req.body.userDetails;

        if (!user || !userDetails) {
            return res.status(400).send('Missing user or user details');
        }

        const { id } = user;
        if (id !== userDetails._id) {
            return res.status(401).send('You do not have the privileges to update this user');
        }

        const updatedUser = await updateUser(id, userDetails);
        if (updatedUser?.message) {
            return res.status(401).send(updatedUser.message);
        }

        res.send(updatedUser);
    } catch (err) {
        logger.error(`Failed to update user: ${(err as Error).message}`);
        res.status((err as any).status || 500).send((err as any).message || 'Failed to update user');
    }
});

export default router;
