import { JobStatus } from './job.model';

export type ReportType = 'Jobs' | 'Revenue' | 'UnpaidBills' | 'BillingHistory' | 'MechanicProductivity';

export type ReportExportFormat = 'pdf' | 'excel';

export interface ReportFilters {
  from?: string;
  to?: string;
  mechanicId?: string;
  status?: JobStatus;
}

export interface ReportData {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | boolean | null>>;
}
