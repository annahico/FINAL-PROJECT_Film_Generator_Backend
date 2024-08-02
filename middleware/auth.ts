import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers/logger';
import { AuthenticatedRequest, JwtPayload } from '../types/custom-types';

dotenv.config();

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        logger.info('Verifying user authentication');
        const jwtSecret = process.env.jwtSecret || '';

        const tokenHeader = req.headers['x-auth-token'];
        if (!tokenHeader) {
            return res.status(401).send('No token, authorization denied');
        }

        // Asegúrate de que tokenHeader sea una cadena
        const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

        if (typeof token !== 'string') {
            return res.status(401).send('Invalid token format');
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        logger.info(`User token valid ${decoded}`);
        (req as unknown as AuthenticatedRequest).token = decoded;

        next();
    } catch (err) {
        logger.error(`Failed to decode user: ${(err as Error).message}`);
        res.status(401).send('Token is not valid');
    }
}

export function getAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const jwtSecret = process.env.jwtSecret || '';
        const tokenHeader = req.headers['x-auth-token'];
        if (tokenHeader) {
            // Asegúrate de que tokenHeader sea una cadena
            const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

            if (typeof token === 'string') {
                const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
                (req as unknown as AuthenticatedRequest).token = decoded;
            }
        }
        next();
    } catch (err) {
        logger.error(`Failed to get auth ${(err as Error).message}`);
        next();
    }
}
