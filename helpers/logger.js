import winston from 'winston';

// Configuración del logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ],
});

export { logger };
