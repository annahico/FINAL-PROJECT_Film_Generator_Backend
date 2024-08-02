// types/custom-types.ts
import { Request } from 'express';

export interface JwtPayload {
    id: string;
    email: string;
    exp?: number; // Agrega exp si es relevante para tu token
}

export interface AuthenticatedRequest extends Request {
    token?: JwtPayload;
    body: {
        user?: JwtPayload;
        userDetails?: any; // Ajusta el tipo según la estructura de userDetails
    };
}
