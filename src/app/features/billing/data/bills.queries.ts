import { Signal, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { JobsApi } from '../../jobs/data/jobs.api';
import { BillsApi } from './bills.api';

export const BILLS_PAGE_SIZE = 20;

export interface BillRow {
  billId: string;
  billNumber: number;
  jobId: string;
  jobNumber: number;
  departmentId: string;
  title: string;
  bikeModel: string;
  total: number;
  isPaid: boolean;
  paidAtUtc: string | null;
  jobDeleted: boolean;
}

export interface AllBillsFilter {
  isPaid: boolean | undefined;
  departmentId: string | undefined;
  page: number;
}

export function injectAllBills(filter: Signal<AllBillsFilter>) {
  const billsApi = inject(BillsApi);
  const jobsApi = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['bills', 'all', filter()],
    queryFn: async () => {
      const { isPaid, departmentId, page } = filter();
      const paged = await firstValueFrom(billsApi.getBills({ isPaid, departmentId, page, pageSize: BILLS_PAGE_SIZE }));
      const jobs = await Promise.all(paged.items.map((b) => firstValueFrom(jobsApi.getJobSummary(b.serviceJobId))));
      const rows: BillRow[] = paged.items.map((b, i) => ({
        billId: b.id,
        billNumber: b.billNumber,
        jobId: b.serviceJobId,
        jobNumber: jobs[i].jobNumber,
        departmentId: b.departmentId,
        title: jobs[i].title,
        bikeModel: jobs[i].bikeModel,
        total: b.total,
        isPaid: b.isPaid,
        paidAtUtc: b.paidAtUtc,
        jobDeleted: jobs[i].deleted,
      }));
      return { rows, totalCount: paged.totalCount };
    },
  }));
}

export function injectBillingSummary() {
  const api = inject(BillsApi);
  return injectQuery(() => ({
    queryKey: ['bills', 'department-summary'],
    queryFn: () => firstValueFrom(api.getBillingSummary()),
  }));
}

export function injectJobBill(jobId: Signal<string>) {
  const api = inject(BillsApi);
  return injectQuery(() => ({
    queryKey: ['bill', jobId()],
    queryFn: () => firstValueFrom(api.getJobBill(jobId())),
    enabled: Boolean(jobId()),
  }));
}
