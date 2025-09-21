import type { Logger, LogLevel, LoggerParams } from '@/core/types';

import { LOG_LEVEL_ORDER } from '@/core/types';

export abstract class BaseLogger implements Logger {
  public level: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.level = (process.env.LOG_LEVEL as LogLevel) || level;
  }

  public shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[this.level];
  }

  abstract debug(params: LoggerParams): void | Promise<void>;
  abstract info(params: LoggerParams): void | Promise<void>;
  abstract warn(params: LoggerParams): void | Promise<void>;
  abstract error(params: LoggerParams): void | Promise<void>;
}
