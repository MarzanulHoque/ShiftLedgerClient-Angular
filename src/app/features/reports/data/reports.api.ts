import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { ReportData, ReportExportFormat, ReportFilters, ReportType } from '../../../core/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsApi {
  constructor(private readonly http: HttpClient) {}

  getReport(type: ReportType, filters: ReportFilters = {}): Observable<ReportData> {
    return this.http.get<ReportData>(`/reports/${type}`, { params: toHttpParams({ ...filters, format: 'json' }) });
  }

  getReportFile(type: ReportType, format: ReportExportFormat, filters: ReportFilters = {}): Observable<Blob> {
    return this.http.get(`/reports/${type}`, {
      params: toHttpParams({ ...filters, format }),
      responseType: 'blob',
    });
  }
}
