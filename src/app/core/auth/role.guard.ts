import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Role } from '../models/auth.model';
import { AuthSessionService } from './auth-session.service';

// Beyond the React app's behavior (which has no route-level role guard, only component-level UI
// swaps) — an explicit, confirmed improvement. See docs/15_Angular_Client.md.
export function requireRoleGuard(allowedRoles: Role[]): CanActivateFn {
  return () => {
    const session = inject(AuthSessionService);
    const router = inject(Router);
    const role = session.user()?.role;

    if (role && allowedRoles.includes(role)) {
      return true;
    }
    return router.createUrlTree(['/dashboard']);
  };
}
