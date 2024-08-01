// tsModels/movieGenerationModel.ts

import { Document } from 'mongoose';

// Define la interfaz para tu modelo de generación de películas
export interface MovieGenerationModel extends Document {
    _id?: string;
    title: string;
    description?: string;
    releaseDate?: Date;
    genre?: string[];
    director?: string;
    cast?: string[];
    createdBy?: string;
}
