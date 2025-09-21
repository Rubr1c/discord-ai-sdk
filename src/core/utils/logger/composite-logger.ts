import type { Logger, LoggerParams, LogLevel } from '@/core/types';
import { BaseLogger } from './base-logger';

export class CompositeLogger extends BaseLogger {
  private loggers: Logger[];

  constructor(loggers: Logger[], level: LogLevel = 'info') {
    super(level);
    this.loggers = loggers;
  }

  debug(params: LoggerParams) {
    this.loggers.forEach((l) => l.debug(params));
  }

  info(params: LoggerParams) {
    this.loggers.forEach((l) => l.info(params));
  }

  warn(params: LoggerParams) {
    this.loggers.forEach((l) => l.warn(params));
  }

  error(params: LoggerParams) {
    this.loggers.forEach((l) => l.error(params));
  }
}
