import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthSessionService } from '../auth/auth-session.service';
import { TokenRefreshService } from '../auth/token-refresh.service';
import { RETRIED_AFTER_REFRESH } from './retried-request.context';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenRefresh = inject(TokenRefreshService);
  const session = inject(AuthSessionService);
  const isAuthEndpoint = req.url.includes('/auth/');

  return next(req).pipe(
    catchError((error: unknown) => {
      const shouldRefresh =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isAuthEndpoint &&
        !req.context.get(RETRIED_AFTER_REFRESH);

      if (!shouldRefresh) {
        return throwError(() => error);
      }

      return tokenRefresh.refreshAccessToken().pipe(
        switchMap((accessToken) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` },
              context: req.context.set(RETRIED_AFTER_REFRESH, true),
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
          session.clearSession();
          window.location.href = '/login';
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
