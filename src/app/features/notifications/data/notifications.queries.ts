import { inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { NotificationsApi } from './notifications.api';

export function injectNotifications() {
  const api = inject(NotificationsApi);
  return injectQuery(() => ({
    queryKey: ['notifications'],
    queryFn: () => firstValueFrom(api.getNotifications({ unreadOnly: false, pageSize: 10 })),
  }));
}

export function injectMarkNotificationReadMutation() {
  const api = inject(NotificationsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (id: string) => firstValueFrom(api.markNotificationRead(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  }));
}
