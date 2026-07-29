import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { AdminDashboardDto, DepartmentDashboardMetricsDto } from '../../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  constructor(private readonly http: HttpClient) {}

  // getMyDashboard (/dashboard/me) is intentionally not ported — Employees never reach this
  // route (app-shell swaps in the mechanic placeholder for that role, same as the React app).
  getAdminDashboard(date?: string): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>('/dashboard/admin', { params: toHttpParams({ date }) });
  }

  getDashboardComparison(date?: string): Observable<DepartmentDashboardMetricsDto[]> {
    return this.http.get<DepartmentDashboardMetricsDto[]>('/dashboard/comparison', { params: toHttpParams({ date }) });
  }
}
