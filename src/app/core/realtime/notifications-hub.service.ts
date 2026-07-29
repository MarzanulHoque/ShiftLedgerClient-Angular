import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryClient } from '@tanstack/angular-query-experimental';

import { NotificationDto, NotificationType } from '../models/notification.model';
import { AuthSessionService } from '../auth/auth-session.service';
import { HUB_URL } from '../http/api-config.token';

// Notification types that mean a job changed — used to also refresh the Jobs board/list live.
// Beyond the React app (which only ever invalidates the notifications cache, so one user's board
// change never live-updates another user's screen) — a confirmed improvement.
// See docs/15_Angular_Client.md.
const JOB_RELATED_TYPES: NotificationType[] = ['JobAssigned', 'JobStatusChanged', 'JobCreated'];

@Injectable({ providedIn: 'root' })
export class NotificationsHubService {
  private connection: HubConnection | null = null;

  constructor(
    private readonly session: AuthSessionService,
    private readonly queryClient: QueryClient,
    private readonly snackBar: MatSnackBar,
    @Inject(HUB_URL) private readonly hubUrl: string,
  ) {}

  connect(): void {
    if (this.connection) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, { accessTokenFactory: () => this.session.accessToken() ?? '' })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('NotificationCreated', (notification: NotificationDto) => {
      this.snackBar.open(notification.message, 'Dismiss', { duration: 4000 });
      void this.queryClient.invalidateQueries({ queryKey: ['notifications'] });

      if (JOB_RELATED_TYPES.includes(notification.type as NotificationType)) {
        void this.queryClient.invalidateQueries({ queryKey: ['jobs'] });
      }
    });

    this.connection.start().catch(() => {
      // Connection retried automatically; a failed initial start just means the bell
      // stays on the last fetched state until the next reconnect attempt.
    });
  }

  disconnect(): void {
    void this.connection?.stop();
    this.connection = null;
  }
}
