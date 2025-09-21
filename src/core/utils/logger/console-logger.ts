import { AIError } from '../../error';
import type { LogLevel } from '../../types';
import { BaseLogger } from './base-logger';

/**
 * Console logger.
 */
export class ConsoleLogger extends BaseLogger {
  /**
   * Creates a console logger.
   * @param level - The level of the logger. @default 'info'
   */
  constructor(level: LogLevel = 'info') {
    super(level);
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
