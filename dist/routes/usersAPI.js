"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.getAuth = getAuth;
var dotenv_1 = __importDefault(require("dotenv"));
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
            // Asegúrate de que tokenHeader sea una cadena
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
//# sourceMappingURL=usersAPI.js.map