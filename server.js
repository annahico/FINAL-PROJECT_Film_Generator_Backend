import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { logger } from './helpers/logger';
import apiMovieRoutes from './routes/api/movies';
import apiUserRoutes from './routes/api/users';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Conectar a la base de datos MongoDB
const db = process.env.MONGO_URI; // Asegúrate de definir MONGO_URI en tu archivo .env
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((err) => {
        logger.error('Database connection error:', err);
    });

// Rutas
app.use('/api/users', apiUserRoutes); // Usa solo una ruta de usuario
app.use('/api/movies', apiMovieRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Welcome to Babel Node');
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
