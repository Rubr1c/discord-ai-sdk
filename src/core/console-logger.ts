import { AIError } from './error';
import type { LogLevel, Logger } from './types';
import { LOG_LEVEL_ORDER } from './types';

export class ConsoleLogger implements Logger {
  private level: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
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
