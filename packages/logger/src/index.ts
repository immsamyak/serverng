import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${service || 'app'}] ${level}: ${message}${metaStr}`;
});

export function createLogger(service: string, level?: string) {
    return winston.createLogger({
        level: level || process.env.LOG_LEVEL || 'info',
        defaultMeta: { service },
        format: combine(
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            process.env.NODE_ENV === 'production'
                ? winston.format.json()
                : combine(colorize(), logFormat)
        ),
        transports: [
            new winston.transports.Console(),
            ...(process.env.NODE_ENV === 'production'
                ? [
                    new winston.transports.File({
                        filename: `/var/log/servermg/${service}-error.log`,
                        level: 'error',
                        maxsize: 10 * 1024 * 1024,
                        maxFiles: 5,
                    }),
                    new winston.transports.File({
                        filename: `/var/log/servermg/${service}.log`,
                        maxsize: 10 * 1024 * 1024,
                        maxFiles: 5,
                    }),
                ]
                : []),
        ],
    });
}

export type Logger = winston.Logger;
export default createLogger;
