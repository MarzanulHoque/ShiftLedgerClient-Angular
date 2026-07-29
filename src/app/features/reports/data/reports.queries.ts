import { Signal, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { ReportFilters, ReportType } from '../../../core/models/report.model';
import { ReportsApi } from './reports.api';

export function injectReport(type: Signal<ReportType>, filters: Signal<ReportFilters>) {
  const api = inject(ReportsApi);
  return injectQuery(() => ({
    queryKey: ['reports', type(), filters()],
    queryFn: () => firstValueFrom(api.getReport(type(), filters())),
  }));
}
