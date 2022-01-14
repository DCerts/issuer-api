import winston from 'winston';
import path from 'path';


const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json(),
        winston.format.colorize(),
        winston.format.printf(
            info => `[${info.timestamp}] [${info.level}]: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error'
        })
    ]
});

export default logger;
