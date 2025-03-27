type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogData = string | number | boolean | null | object | unknown;

interface LogMessage {
    level: LogLevel;
    message: string;
    data?: LogData;
    timestamp: string;
}

class Logger {
    private static instance: Logger;
    private isDevelopment: boolean;
    private logs: LogMessage[] = [];

    private constructor() {
        this.isDevelopment = import.meta.env.DEV;
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: LogLevel, message: string, data?: LogData): LogMessage {
        return {
            level,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    private log(level: LogLevel, message: string, data?: LogData) {
        const logMessage = this.formatMessage(level, message, data);
        this.logs.push(logMessage);

        if (this.isDevelopment) {
            switch (level) {
                case 'debug':
                    console.debug(message, data);
                    break;
                case 'info':
                    console.info(message, data);
                    break;
                case 'warn':
                    console.warn(message, data);
                    break;
                case 'error':
                    console.error(message, data);
                    break;
            }
        }
    }

    debug(message: string, data?: LogData) {
        this.log('debug', message, data);
    }

    info(message: string, data?: LogData) {
        this.log('info', message, data);
    }

    warn(message: string, data?: LogData) {
        this.log('warn', message, data);
    }

    error(message: string, data?: LogData) {
        this.log('error', message, data);
    }

    getLogs(): LogMessage[] {
        return [...this.logs];
    }

    clearLogs() {
        this.logs = [];
    }
}

export const logger = Logger.getInstance(); 