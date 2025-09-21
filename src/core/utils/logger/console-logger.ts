import { AIError } from '@/core/error';
import type { LoggerParams, LogLevel } from '../../types';
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

  debug(params: LoggerParams) {
    if (!this.shouldLog('debug')) return;
    console.debug(`[DEBUG] ${params.message}`, params.meta ?? '');
  }

  info(params: LoggerParams) {
    if (!this.shouldLog('info')) return;
    console.info(`[INFO] ${params.message}`, params.meta ?? '');
  }

  warn(params: LoggerParams) {
    if (!this.shouldLog('warn')) return;
    console.warn(`[WARN] ${params.message}`, params.meta ?? '');
  }

  error(params: LoggerParams) {
    if (!this.shouldLog('error')) return;
    if (params.error instanceof AIError) {
      console.error(`[ERROR:${params.error.getReason()}] ${params.error.message}`, {
        stack: params.error.stack,
        meta: params.meta,
      });
    } else {
      console.error(`[ERROR] ${params.message}`, params.meta ?? '');
    }
  }
}
