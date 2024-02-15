import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const levels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'bold red',
        warn: 'bold yellow',
        info: 'bold blue',
        debug: 'bold gray'
    }
};

const format = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});

export const logger = winston.createLogger({
    format: combine(
        winston.format((info) => {
            info.level = info.level.toUpperCase();
            return info;
        })(),
        colorize({ level: true, colors: levels.colors }),
        timestamp(),
        format
    ),
    levels: levels.levels,
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
