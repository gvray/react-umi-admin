import { Logger, LogLevel } from '@gvray/logger';

const logger = new Logger({ level: LogLevel.TRACE, timestamp: 'time' });

export default logger;
