import { Component, computed } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { UtcDateTimePipe } from '../../utils/date.pipes';
import { injectMarkNotificationReadMutation, injectNotifications } from '../../../features/notifications/data/notifications.queries';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule, UtcDateTimePipe],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent {
  readonly notificationsQuery = injectNotifications();
  readonly markRead = injectMarkNotificationReadMutation();

  readonly unreadCount = computed(() => this.notificationsQuery.data()?.items.filter((n) => !n.isRead).length ?? 0);

  onSelect(id: string): void {
    this.markRead.mutate(id);
  }
}
