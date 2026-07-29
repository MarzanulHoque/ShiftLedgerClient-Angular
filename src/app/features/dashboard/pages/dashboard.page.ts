import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import dayjs from 'dayjs';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { JobStatus } from '../../../core/models/job.model';
import { AreaChartComponent } from '../../../shared/components/area-chart/area-chart.component';
import { DonutChartComponent, DonutSegment } from '../../../shared/components/donut-chart/donut-chart.component';
import { DEPARTMENT_CHART_COLORS, STATUS_CHART_COLOR } from '../../../shared/utils/chart-colors.util';
import { dueChip } from '../../../shared/utils/due-chip.util';
import { timeAgo } from '../../../shared/utils/date.util';
import { initials } from '../../../shared/utils/initials.util';
import { formatMoney } from '../../../shared/utils/money.util';
import { STATUS_META } from '../../../shared/utils/status-meta';
import { injectNotifications } from '../../notifications/data/notifications.queries';
import { injectOrgSettings } from '../../org-settings/data/org-settings.queries';
import { injectMechanics } from '../../users/data/users.queries';
import { StatTileComponent } from '../components/stat-tile/stat-tile.component';
import {
  injectAdminDashboard,
  injectDashboardComparison,
  injectDueSoonJobs,
  injectRecentPayments,
  injectRevenueTrend,
  injectTopUnpaidBills,
  injectYesterdayDashboard,
} from '../data/dashboard.queries';

// Bars/donut always show these three in this order, even at zero — GetAdminDashboardQuery only
// returns rows for statuses that actually have jobs, so a quiet day would otherwise render an
// empty panel instead of a real (if flat) chart. Delivered is a footnote, not a segment.
const DONUT_STATUSES: JobStatus[] = ['Received', 'InProgress', 'Completed'];

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, StatTileComponent, DonutChartComponent, AreaChartComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly router = inject(Router);
  private readonly session = inject(AuthSessionService);

  readonly dashboardQuery = injectAdminDashboard();
  readonly yesterdayQuery = injectYesterdayDashboard();
  readonly comparisonQuery = injectDashboardComparison();
  readonly unpaidBillsQuery = injectTopUnpaidBills(6);
  readonly dueSoonQuery = injectDueSoonJobs(5);
  readonly revenueTrendQuery = injectRevenueTrend(14);
  readonly recentPaymentsQuery = injectRecentPayments(6);
  readonly orgSettingsQuery = injectOrgSettings();
  readonly notificationsQuery = injectNotifications();
  readonly mechanicsQuery = injectMechanics();

  readonly statusMeta = STATUS_META;
  readonly today = dayjs().format('dddd, MMMM D');

  get user() {
    return this.session.user();
  }

  get isSuperAdmin(): boolean {
    return this.user?.role === 'SuperAdmin';
  }

  get greetingName(): string {
    const user = this.user;
    if (!user) return '';
    const match = this.mechanicsQuery.users.data()?.find((u) => u.id === user.id);
    return match?.fullName ?? user.email.split('@')[0];
  }

  money(amount: number): string {
    return formatMoney(amount, this.orgSettingsQuery.data()?.currencyCode);
  }

  readonly moneyFormatter = (amount: number): string => this.money(amount);

  hasPositive(segments: DonutSegment[]): boolean {
    return segments.some((s) => s.value > 0);
  }

  get openJobsToday(): number {
    const jobsByStatus = this.dashboardQuery.data()?.jobsByStatus ?? [];
    return jobsByStatus.filter((s) => s.status !== 'Delivered').reduce((sum, s) => sum + s.count, 0);
  }

  get yesterdayOpenJobs(): number | undefined {
    const jobsByStatus = this.yesterdayQuery.data()?.jobsByStatus;
    if (!jobsByStatus) return undefined;
    return jobsByStatus.filter((s) => s.status !== 'Delivered').reduce((sum, s) => sum + s.count, 0);
  }

  get statusDonutSegments(): DonutSegment[] {
    const jobsByStatus = this.dashboardQuery.data()?.jobsByStatus ?? [];
    return DONUT_STATUSES.map((status) => ({
      label: STATUS_META[status].label,
      value: jobsByStatus.find((s) => s.status === status)?.count ?? 0,
      color: STATUS_CHART_COLOR[status],
    }));
  }

  get deliveredCount(): number {
    return this.dashboardQuery.data()?.jobsByStatus.find((s) => s.status === 'Delivered')?.count ?? 0;
  }

  get departmentJobsSegments(): DonutSegment[] {
    return (this.comparisonQuery.data() ?? []).map((d, i) => ({
      label: d.departmentName,
      value: d.openJobs,
      color: DEPARTMENT_CHART_COLORS[i % DEPARTMENT_CHART_COLORS.length],
    }));
  }

  get departmentRevenueSegments(): DonutSegment[] {
    return (this.comparisonQuery.data() ?? []).map((d, i) => ({
      label: d.departmentName,
      value: d.revenueToday,
      color: DEPARTMENT_CHART_COLORS[i % DEPARTMENT_CHART_COLORS.length],
    }));
  }

  get departmentThroughputSegments(): DonutSegment[] {
    return (this.comparisonQuery.data() ?? []).map((d, i) => ({
      label: d.departmentName,
      value: d.throughputLast7Days,
      color: DEPARTMENT_CHART_COLORS[i % DEPARTMENT_CHART_COLORS.length],
    }));
  }

  get departmentReceivedTodayTotal(): number {
    return (this.comparisonQuery.data() ?? []).reduce((sum, d) => sum + d.jobsReceivedToday, 0);
  }

  get departmentUnpaidTotal(): number {
    return (this.comparisonQuery.data() ?? []).reduce((sum, d) => sum + d.unpaidTotal, 0);
  }

  get revenueTrendPoints() {
    return (this.revenueTrendQuery.data() ?? []).map((p) => ({ label: p.date, value: p.revenue }));
  }

  formatTrendLabel = (isoDate: string): string => dayjs(isoDate).format('MMM D');

  mechanicWorkloadSorted() {
    return [...(this.dashboardQuery.data()?.mechanicWorkload ?? [])].sort((a, b) => b.openJobs - a.openJobs);
  }

  mechanicNameFor(id: string | null): string | undefined {
    return this.mechanicsQuery.mechanics().find((m) => m.id === id)?.fullName;
  }

  dueChipFor(dueDate: string | null | undefined) {
    return dueChip(dueDate);
  }

  timeAgoFor(utcIso: string): string {
    return timeAgo(utcIso);
  }

  initialsFor(name: string): string {
    return initials(name);
  }

  goToJob(id: string): void {
    void this.router.navigateByUrl(`/jobs/${id}`);
  }

  goToJobsBoard(): void {
    void this.router.navigateByUrl('/jobs');
  }

  goToNewJob(): void {
    void this.router.navigate(['/jobs'], { queryParams: { new: 1 } });
  }

  goToBills(): void {
    void this.router.navigateByUrl('/bills');
  }

  goToReports(): void {
    void this.router.navigateByUrl('/reports');
  }
}
