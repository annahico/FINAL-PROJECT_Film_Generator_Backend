"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.getAuth = getAuth;
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = require("express");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var logger_1 = require("../helpers/logger");
dotenv_1.default.config();
function auth(req, res, next) {
    try {
        logger_1.logger.info('Verifying user authentication');
        var jwtSecret = process.env.jwtSecret || '';
        var tokenHeader = req.headers['x-auth-token'];
        if (!tokenHeader) {
            return res.status(401).send('No token, authorization denied');
        }
        var token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;
        if (typeof token !== 'string') {
            return res.status(401).send('Invalid token format');
        }
        var decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        logger_1.logger.info("User token valid ".concat(decoded));
        req.token = decoded;
        next();
    }
    catch (err) {
        logger_1.logger.error("Failed to decode user: ".concat(err.message));
        res.status(401).send('Token is not valid');
    }
}
function getAuth(req, res, next) {
    try {
        var jwtSecret = process.env.jwtSecret || '';
        var tokenHeader = req.headers['x-auth-token'];
        if (tokenHeader) {
            var token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;
            if (typeof token === 'string') {
                var decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                req.token = decoded;
            }
        }
        next();
    }
    catch (err) {
        logger_1.logger.error("Failed to get auth ".concat(err.message));
        next();
    }
}
// Creación de las rutas de la API
var apiUserRoutes = (0, express_1.Router)();
// Ruta pública (sin autenticación)
apiUserRoutes.get('/public', function (req, res) {
    res.send('This is a public route');
});
// Ruta protegida (requiere autenticación)
apiUserRoutes.get('/protected', auth, function (req, res) {
    res.send('This is a protected route, you are authenticated!');
});
// Ruta semi-protegida (opcionalmente autenticada)
apiUserRoutes.get('/semi-protected', getAuth, function (req, res) {
    if (req.token) {
        res.send('You are authenticated, access granted to semi-protected content');
    }
    else {
        res.send('You are not authenticated, but you can still access this route');
    }
});
// Ejemplo de manejo de errores
apiUserRoutes.use(function (err, req, res) {
    logger_1.logger.error("Unexpected error: ".concat(err.message));
    res.status(500).send('Internal server error');
});
exports.default = apiUserRoutes;
//# sourceMappingURL=usersAPI.js.map