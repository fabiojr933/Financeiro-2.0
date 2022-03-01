import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.simple(),
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)),
    transports: [
        new winston.transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../../log/log.log`            
        }),
        new winston.transports.Console({
            level: 'debug'
        })
    ]
}); 
export default logger;