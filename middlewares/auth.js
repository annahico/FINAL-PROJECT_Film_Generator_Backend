const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        // Obtener el token de diferentes fuentes: cookies, cuerpo de la solicitud, o cabecera Authorization
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "Token is missing" });
        }

        try {
            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Añadir el usuario decodificado al objeto de solicitud para el acceso en otras rutas
        } catch (error) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

        // Continuar con la siguiente función de middleware o la ruta protegida
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `An error occurred while validating the token: ${error.message}`,
        });
    }
};
