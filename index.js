const express = require('express');
const app = express();
const database = require("./configs/database.configs");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { PORT } = require('./utils/dotenvVariables');
const userRouter = require('./routers/Auth.Route');
const userMovie = require("./routers/Movie.Route");

// Conectar a la base de datos
database.connect();

// Agregar middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Definir rutas
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/movie", userMovie);

// Ruta principal para verificar el estado del servidor
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Success running..."
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
