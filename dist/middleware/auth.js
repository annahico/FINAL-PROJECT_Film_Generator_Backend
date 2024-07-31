"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.generationAuth = generationAuth;
exports.getAuth = getAuth;
var dotenv_1 = __importDefault(require("dotenv"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var logger_1 = require("../helpers/logger");
dotenv_1.default.config();
function auth(req, res, next) {
    try {
        logger_1.logger.info('Verifying user authentication');
        var jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';
        var token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).send('No token, authorization denied');
        }
        var decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        logger_1.logger.info("User token valid ".concat(decoded));
        // Add user from payload
        req.body.user = decoded;
        next();
    }
    catch (err) {
        logger_1.logger.error("Failed to decode user: ".concat(err.message));
        next();
    }
}
function generationAuth(req, res, next) {
    try {
        logger_1.logger.info('Verifying user authentication');
        var jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';
        var token = req.headers['x-auth-token'];
        var decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        logger_1.logger.info("User token valid ".concat(decoded));
        // Add user from payload
        req.body.user = decoded;
        next();
    }
    catch (err) {
        logger_1.logger.error("Failed to decode user: ".concat(err.message));
        next();
    }
}
function getAuth(req, res, next) {
    try {
        var jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : '';
        var token = req.headers['x-auth-token'] ? req.headers['x-auth-token'] : null;
        if (token) {
            req.token = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        next();
    }
    catch (err) {
        logger_1.logger.error("Failed to get auth ".concat(err.message));
        next();
    }
}
//# sourceMappingURL=auth.js.map