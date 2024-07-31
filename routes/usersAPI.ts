import express from 'express';
import { logger } from '../../helpers/logger';
import UserSchema from '../../MongoModels/userModel';

// eslint-disable-next-line new-cap
const router = express.Router();

/** 
 * @Route POST /api/users/register
 * @Desc Provides API to register a new user
 */
router.post('/register', (req, res) => {
    const newUser = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    newUser.save()
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send('Error registering user');
        });
});

/** 
 * @Route POST /api/users/login
 * @Desc Provides API for user login
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    UserSchema.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).send('No user found with this email');
            }

            if (password === user.password) {
                res.status(200).json(user);
            } else {
                res.status(401).send('Incorrect password');
            }
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send('Error logging in');
        });
});

/** 
 * @Route POST /api/users/update
 * @Desc Provides API to update a user's profile
 */
router.post('/update', (req, res) => {
    const { email, password } = req.body;

    UserSchema.updateOne({ email }, { $set: { password } })
        .then((result) => {
            if (result.modifiedCount > 0) {
                res.status(200).send(`User updated: ${email}`);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send('Error updating user');
        });
});

/** 
 * @Route POST /api/users/delete
 * @Desc Provides API to delete a user's profile
 */
router.post('/delete', (req, res) => {
    const { email } = req.body;

    UserSchema.deleteOne({ email })
        .then((result) => {
            if (result.deletedCount > 0) {
                res.status(200).send(`User with email ${email} successfully deleted`);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send('Error deleting user');
        });
});

export default router;
