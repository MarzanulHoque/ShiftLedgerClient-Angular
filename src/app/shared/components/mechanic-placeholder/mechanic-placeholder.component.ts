import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AuthSessionService } from '../../../core/auth/auth-session.service';

// The mechanic (Employee) dashboard is API-ready (/dashboard/me, own-jobs scoping) but its screen
// is deferred to a later UI pass, matching the React app's MechanicPlaceholder.
@Component({
  selector: 'app-mechanic-placeholder',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="mechanic-placeholder">
      <h2>ShiftLedger</h2>
      <p>The mechanic view isn't available yet — check back soon.</p>
      <button mat-button (click)="session.clearSession()">Log out</button>
    </div>
  `,
  styles: [
    `
      .mechanic-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        min-height: 100vh;
        text-align: center;
      }
    `,
  ],
})
export class MechanicPlaceholderComponent {
  constructor(readonly session: AuthSessionService) {}
}
