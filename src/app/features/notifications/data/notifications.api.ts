import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { NotificationDto } from '../../../core/models/notification.model';
import { PagedResult } from '../../../core/models/paged-result.model';

export interface GetNotificationsParams {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  constructor(private readonly http: HttpClient) {}

  getNotifications(params: GetNotificationsParams = {}): Observable<PagedResult<NotificationDto>> {
    return this.http.get<PagedResult<NotificationDto>>('/notifications', { params: toHttpParams(params) });
  }

  markNotificationRead(id: string): Observable<void> {
    return this.http.patch<void>(`/notifications/${id}/read`, {});
  }
}
