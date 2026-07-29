import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

// Beyond the React app (which has no rowVersion/409 handling at all) — a confirmed improvement:
// centralizes the "record changed, reload" surfacing DEVELOPMENT_RULES.md §8 calls for, instead
// of leaving each mutation to handle a stale write on its own. See docs/15_Angular_Client.md.
export const concurrencyInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        snackBar.open('This record changed — reload and try again.', 'Reload', { duration: 6000 }).onAction().subscribe(() => {
          window.location.reload();
        });
      }
      return throwError(() => error);
    }),
  );
};
