import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import endpoints from './endpoints.config';
import { logger } from './helpers/logger';
import apiMovieRoutes from './routes/moviesAPI';
import apiUserRoutes from './routes/usersAPI';

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());  // Additional configuration can be added here if needed
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start server
app.listen(process.env.PORT, () => {
    logger.info(` 🚀 Server is listening on port ${endpoints.PORT}`);
});

// MongoDB configuration and connection
const db = endpoints.MONGO_URI;
mongoose.connect(db)
    .then(() => {
        console.log('Mongoose successfully connected');
        logger.info('🛢️ Mongoose successfully connected');
    })
    .catch((err) => {
        logger.error('Mongoose connection error:', err);
    });

// Routes
app.use('/api/users', apiUserRoutes);
app.use('/api/movies', apiMovieRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to babel node');
});

// Error handling middleware (for catching errors in routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
