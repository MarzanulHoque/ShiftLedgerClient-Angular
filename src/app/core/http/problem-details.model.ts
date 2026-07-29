import { HttpErrorResponse } from '@angular/common/http';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

export function extractLoginError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 423) {
      return 'Account temporarily locked after repeated failed attempts. Try again shortly.';
    }
    const detail = (error.error as ProblemDetails | undefined)?.detail;
    if (detail) {
      return detail;
    }
  }
  return 'Invalid email or password.';
}
