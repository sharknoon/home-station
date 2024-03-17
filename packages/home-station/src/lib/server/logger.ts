import winston from 'winston';
import Transport, { type TransportStreamOptions } from 'winston-transport';

type Log = {
    message: string;
    level: string;
    timestamp: string;
};

type ArrayTransportOptions = TransportStreamOptions & {
    name?: string;
    array?: Log[];
    limit?: number;
};

class ArrayTransport extends Transport {
    name: string;
    array: Log[];
    limit: number | undefined; // Undefined means no limit

    constructor(options: ArrayTransportOptions = {}) {
        super(options);

        this.name = options.name || 'array-transport';
        this.array = options.array || [];
        this.limit = options.limit;
        this.setMaxListeners(30);
    }

    log(info: Log, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        // The keys are symbols, so we need to convert them to strings to be able to stringify them with devalue
        this.array.push({
            message: info.message,
            level: info.level,
            timestamp: info.timestamp
        });
        if (this.limit && this.array.length > this.limit) {
            this.array.shift();
        }
        callback();
    }
}

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

export type Level = keyof typeof levels.levels;

const format = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});

export const logs: Log[] = [];

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
    transports: [new winston.transports.Console(), new ArrayTransport({ array: logs, limit: 30 })]
});
