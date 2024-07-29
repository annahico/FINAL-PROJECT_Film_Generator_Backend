import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api/api';
const app = express();
const env = dotenv.config().parsed;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(env.PORT, () => {
    console.log(`app is listening to port ${env.PORT}`);
});

//config mongodb
const db = env.MONGO_URI;
//connect to db
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose successfully connected');
    }).catch((err) => {
        console.log(err);
    });


app.use("/api", apiRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to babel node');
});