import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { NotificationsHubService } from '../../../core/realtime/notifications-hub.service';
import { initials } from '../../utils/initials.util';
import { MechanicPlaceholderComponent } from '../mechanic-placeholder/mechanic-placeholder.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/jobs', label: 'Jobs', icon: 'build' },
  { path: '/bills', label: 'Billing', icon: 'receipt_long' },
  { path: '/reports', label: 'Reports', icon: 'analytics' },
  { path: '/users', label: 'Users & Org', icon: 'group' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MechanicPlaceholderComponent,
    NotificationBellComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent implements OnInit, OnDestroy {
  readonly navItems = NAV_ITEMS;

  constructor(
    readonly session: AuthSessionService,
    private readonly router: Router,
    private readonly notificationsHub: NotificationsHubService,
  ) {
    // A valid accessToken but no decoded user means the token's claims didn't parse as expected
    // (see core/auth/jwt.util.ts) — that's a broken session, not a legitimate mechanic one, so
    // force a fresh login rather than silently showing the mechanic placeholder.
    effect(() => {
      if (this.session.isAuthenticated() && !this.session.user()) {
        this.session.clearSession();
      }
    });
  }

  ngOnInit(): void {
    if (!this.session.isAuthenticated()) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.notificationsHub.connect();
  }

  ngOnDestroy(): void {
    this.notificationsHub.disconnect();
  }

  initialsFor(email: string): string {
    return initials(email);
  }

  logout(): void {
    this.notificationsHub.disconnect();
    this.session.clearSession();
    void this.router.navigateByUrl('/login');
  }
}
