import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { ReportData, ReportFilters, ReportType } from '../../../core/models/report.model';

// Reports itself is a later pass — this is only the read used by the Dashboard's revenue-trend
// panel (GetReportQuery('Revenue', ...) already returns day-by-day figures, so no new endpoint
// is needed). Extend this file when the full Reports slice is built.
@Injectable({ providedIn: 'root' })
export class ReportsApi {
  constructor(private readonly http: HttpClient) {}

  getReport(type: ReportType, filters: ReportFilters = {}): Observable<ReportData> {
    return this.http.get<ReportData>(`/reports/${type}`, { params: toHttpParams({ ...filters, format: 'json' }) });
  }
}
