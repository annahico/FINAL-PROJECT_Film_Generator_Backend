import dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';
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

// Creación de las rutas de la API
const apiUserRoutes = Router();

// Ruta pública (sin autenticación)
apiUserRoutes.get('/public', (req: Request, res: Response) => {
    res.send('This is a public route');
});

// Ruta protegida (requiere autenticación)
apiUserRoutes.get('/protected', auth, (req: Request, res: Response) => {
    res.send('This is a protected route, you are authenticated!');
});

// Ruta semi-protegida (opcionalmente autenticada)
apiUserRoutes.get('/semi-protected', getAuth, (req: Request, res: Response) => {
    if ((req as unknown as AuthenticatedRequest).token) {
        res.send('You are authenticated, access granted to semi-protected content');
    } else {
        res.send('You are not authenticated, but you can still access this route');
    }
});

// Ejemplo de manejo de errores
apiUserRoutes.use((err: Error, req: Request, res: Response) => {
    logger.error(`Unexpected error: ${err.message}`);
    res.status(500).send('Internal server error');
});

export default apiUserRoutes;
