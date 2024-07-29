import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import endpoints from './endpoints.config';
import { logger } from './helpers/logger';
import apiMovieRoutes from './routes/movies';
import apiUserRoutes from './routes/users';

const app = express();
dotenv.config();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use('/api/users', apiUserRoutes);
app.use('/api/movies', apiMovieRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to babel node');
});

// Start server
const PORT = process.env.PORT || endpoints.PORT;
app.listen(PORT, () => {
    logger.info(`App is listening on port ${PORT}`);
});

// MongoDB configuration
const db = process.env.MONGO_URI || endpoints.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('Mongoose successfully connected');
    })
    .catch((err) => {
        logger.error(err);
    });
