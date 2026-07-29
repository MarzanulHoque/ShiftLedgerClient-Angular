export type ReportType = 'Jobs' | 'Revenue' | 'UnpaidBills' | 'BillingHistory' | 'MechanicProductivity';

export interface ReportFilters {
  from?: string;
  to?: string;
}

export interface ReportData {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | boolean | null>>;
}
