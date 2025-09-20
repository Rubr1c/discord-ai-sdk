import { AIError } from '../error';
import type { LogLevel, Logger } from '../types';
import { LOG_LEVEL_ORDER } from '../types';

/**
 * Console logger.
 */
export class ConsoleLogger implements Logger {
  public level: LogLevel;

  /**
   * Creates a console logger.
   * @param level - The level of the logger. @default 'info'
   */
  constructor(level: LogLevel = 'info') {
    this.level = level;
    if (process.env.LOG_LEVEL) {
      this.level = process.env.LOG_LEVEL as LogLevel;
    }
  }

  /**
   * Checks if a log level should be logged.
   * @param level - The level to check.
   * @returns True if the level should be logged, false otherwise.
   */
  public shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[this.level];
  }

  debug(msg: string, meta?: unknown) {
    if (!this.shouldLog('debug')) return;
    console.debug(`[DEBUG] ${msg}`, meta ?? '');
  }

  info(msg: string, meta?: unknown) {
    if (!this.shouldLog('info')) return;
    console.info(`[INFO] ${msg}`, meta ?? '');
  }

  warn(msg: string, meta?: unknown) {
    if (!this.shouldLog('warn')) return;
    console.warn(`[WARN] ${msg}`, meta ?? '');
  }

  error(msg: string | AIError, meta?: unknown) {
    if (!this.shouldLog('error')) return;
    if (msg instanceof AIError) {
      console.error(`[ERROR:${msg.getReason()}] ${msg.message}`, { stack: msg.stack, meta });
    } else {
      console.error(`[ERROR] ${msg}`, meta ?? '');
    }
  }
}
