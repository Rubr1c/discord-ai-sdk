import type { Logger, LogLevel } from '@/core/types';

import { LOG_LEVEL_ORDER } from '@/core/types';

export abstract class BaseLogger implements Logger {
  public level: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.level = (process.env.LOG_LEVEL as LogLevel) || level;
  }

  public shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[this.level];
  }

  abstract debug(message: string, meta?: unknown): void | Promise<void>;
  abstract info(message: string, meta?: unknown): void | Promise<void>;
  abstract warn(message: string, meta?: unknown): void | Promise<void>;
  abstract error(message: string | Error, meta?: unknown): void | Promise<void>;
}
