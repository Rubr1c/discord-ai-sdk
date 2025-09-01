import { ErrorReason } from './types';

export class AIError extends Error {
  private reason: keyof typeof ErrorReason;

  constructor(reason: keyof typeof ErrorReason, msg: string) {
    super(`[${ErrorReason[reason]}]: ${msg}`);
    this.reason = reason;
  }

  public getReason(): keyof typeof ErrorReason {
    return this.reason;
  }
}
