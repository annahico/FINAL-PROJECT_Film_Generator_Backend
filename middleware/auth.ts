import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers/logger';

dotenv.config();

interface JwtPayload {
    id: string;
    email: string;
}

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('Verifying user authentication');
        const jwtSecret = process.env.jwtSecret || '';

        const token = req.headers['x-auth-token'] as string | undefined;
        if (!token) {
            return res.status(401).send('No token, authorization denied');
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        logger.info(`User token valid: ${JSON.stringify(decoded)}`);
        req.body.user = decoded;

        next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to decode user: ${err.message}`);
        } else {
            logger.error('Failed to decode user: Unknown error');
        }
        res.status(401).send('Invalid token');
    }
}

export function generationAuth(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('Verifying user authentication');
        const jwtSecret = process.env.jwtSecret || '';

        const token = req.headers['x-auth-token'] as string | undefined;
        if (token) {
            const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
            logger.info(`User token valid: ${JSON.stringify(decoded)}`);
            req.body.user = decoded;
        }

        next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to decode user: ${err.message}`);
        } else {
            logger.error('Failed to decode user: Unknown error');
        }
        next();
    }
}

export function getAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const jwtSecret = process.env.jwtSecret || '';
        const token = req.headers['x-auth-token'] as string | undefined;
        if (token) {
            req.token = jwt.verify(token, jwtSecret) as JwtPayload;
        }
        next();
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to get auth: ${err.message}`);
        } else {
            logger.error('Failed to get auth: Unknown error');
        }
        next();
    }
}
