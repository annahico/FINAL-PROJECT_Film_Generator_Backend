import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers/logger';

dotenv.config();

export function auth(req: any, res: any, next: any) {
    try {
        logger.info('Verifying user authentication');
        const jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';

        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).send('No token, authorization denied');
        }
        const decoded = jwt.verify(token, jwtSecret);
        logger.info(`User token valid ${decoded}`);
        // Add user from payload
        req.body.user = decoded;

        next();
    } catch (err) {
        logger.error(`Failed to decode user: ${(err as Error).message}`);
        next();
    }
}

export function generationAuth(req: any, res: any, next: any) {
    try {
        logger.info('Verifying user authentication');
        const jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';

        const token = req.headers['x-auth-token'];
        const decoded = jwt.verify(token, jwtSecret);
        logger.info(`User token valid ${decoded}`);
        // Add user from payload
        req.body.user = decoded;

        next();
    } catch (err) {
        logger.error(`Failed to decode user: ${(err as Error).message}`);
        next();
    }
}

export function getAuth(req: any, res: any, next: any) {
    try {
        const jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';
        const token = req.headers['x-auth-token'] ? req.headers['x-auth-token'] : null;
        if (token) {
            req.token = jwt.verify(token, jwtSecret);
        }
        next();
    } catch (err) {
        logger.error(`Failed to get auth ${(err as Error).message}`);
        next();
    }
}
