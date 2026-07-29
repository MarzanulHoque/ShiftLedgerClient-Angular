import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';

import { JobDto } from '../../../core/models/job.model';
import { BillsApi } from '../../billing/data/bills.api';
import { JobsApi } from '../../jobs/data/jobs.api';
import { ReportsApi } from '../../reports/data/reports.api';
import { DashboardApi } from './dashboard.api';

export function injectAdminDashboard() {
  const api = inject(DashboardApi);
  return injectQuery(() => ({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => firstValueFrom(api.getAdminDashboard()),
  }));
}

// SuperAdmin cockpit only — DepartmentAdmin's own-department numbers already come from
// injectAdminDashboard, since GetAdminDashboardQuery is department-scoped.
export function injectDashboardComparison() {
  const api = inject(DashboardApi);
  return injectQuery(() => ({
    queryKey: ['dashboard', 'comparison'],
    queryFn: () => firstValueFrom(api.getDashboardComparison()),
  }));
}

// Yesterday's snapshot, for "vs yesterday" trend deltas on the stat tiles — GetAdminDashboardQuery
// already takes an arbitrary date, so no new endpoint is needed for this comparison.
export function injectYesterdayDashboard() {
  const api = inject(DashboardApi);
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  return injectQuery(() => ({
    queryKey: ['dashboard', 'admin', yesterday],
    queryFn: () => firstValueFrom(api.getAdminDashboard(yesterday)),
  }));
}

export interface UnpaidBillRow {
  billId: string;
  jobId: string;
  title: string;
  bikeModel: string;
  total: number;
  jobDeleted: boolean;
}

export function injectTopUnpaidBills(limit = 6) {
  const billsApi = inject(BillsApi);
  const jobsApi = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['dashboard', 'top-unpaid-bills', limit],
    queryFn: async () => {
      const paged = await firstValueFrom(billsApi.getBills({ isPaid: false, page: 1, pageSize: limit }));
      const jobs = await Promise.all(paged.items.map((b) => firstValueFrom(jobsApi.getJobSummary(b.serviceJobId))));
      const rows: UnpaidBillRow[] = paged.items.map((b, i) => ({
        billId: b.id,
        jobId: b.serviceJobId,
        title: jobs[i].title,
        bikeModel: jobs[i].bikeModel,
        total: b.total,
        jobDeleted: jobs[i].deleted,
      }));
      return { rows, totalCount: paged.totalCount };
    },
  }));
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

// The Revenue report gives day-by-day figures for any date range — reused here instead of
// inventing a new endpoint. AdminDashboardDto only ever carries "today"; a trend needs history.
export function injectRevenueTrend(days = 14) {
  const api = inject(ReportsApi);
  const to = dayjs().format('YYYY-MM-DD');
  const from = dayjs().subtract(days - 1, 'day').format('YYYY-MM-DD');

  return injectQuery(() => ({
    queryKey: ['dashboard', 'revenue-trend', from, to],
    queryFn: async () => {
      const report = await firstValueFrom(api.getReport('Revenue', { from, to }));
      const byDate = new Map(report.rows.map((row) => [String(row[0]), Number(row[2]) || 0]));

      const points: RevenueTrendPoint[] = [];
      for (let i = 0; i < days; i++) {
        const date = dayjs(from).add(i, 'day').format('YYYY-MM-DD');
        points.push({ date, revenue: byDate.get(date) ?? 0 });
      }
      return points;
    },
  }));
}

export interface RecentPaymentRow {
  billId: string;
  jobId: string;
  title: string;
  bikeModel: string;
  total: number;
  paidAtUtc: string;
  jobDeleted: boolean;
}

export function injectRecentPayments(limit = 6) {
  const billsApi = inject(BillsApi);
  const jobsApi = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['dashboard', 'recent-payments', limit],
    queryFn: async () => {
      const paged = await firstValueFrom(billsApi.getBills({ isPaid: true, page: 1, pageSize: 20 }));
      const sorted = paged.items
        .filter((b): b is typeof b & { paidAtUtc: string } => b.paidAtUtc !== null)
        .sort((a, b) => (a.paidAtUtc < b.paidAtUtc ? 1 : -1))
        .slice(0, limit);
      const jobs = await Promise.all(sorted.map((b) => firstValueFrom(jobsApi.getJobSummary(b.serviceJobId))));
      const rows: RecentPaymentRow[] = sorted.map((b, i) => ({
        billId: b.id,
        jobId: b.serviceJobId,
        title: jobs[i].title,
        bikeModel: jobs[i].bikeModel,
        total: b.total,
        paidAtUtc: b.paidAtUtc,
        jobDeleted: jobs[i].deleted,
      }));
      return rows;
    },
  }));
}

export function injectDueSoonJobs(limit = 5) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['dashboard', 'due-soon', limit],
    queryFn: async () => {
      const paged = await firstValueFrom(api.getJobs({ pageSize: 100 }));
      return paged.items
        .filter((j): j is JobDto & { dueDate: string } => j.status !== 'Delivered' && j.dueDate !== null)
        .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
        .slice(0, limit);
    },
  }));
}
