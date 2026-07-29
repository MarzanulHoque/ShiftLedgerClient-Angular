import { firstValueFrom } from 'rxjs';

import { ReportExportFormat, ReportFilters, ReportType } from '../../../core/models/report.model';
import { ReportsApi } from './reports.api';

// Fire-and-forget browser download, not cached data — a plain function (matching billing's
// downloadInvoice) rather than a mutation.
export async function downloadReport(
  api: ReportsApi,
  type: ReportType,
  format: ReportExportFormat,
  filters: ReportFilters = {},
): Promise<void> {
  const blob = await firstValueFrom(api.getReportFile(type, format, filters));
  const extension = format === 'pdf' ? 'pdf' : 'xlsx';
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}
