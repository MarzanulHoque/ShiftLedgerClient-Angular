import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { JobStatus } from '../../../core/models/job.model';
import { ReportExportFormat, ReportFilters, ReportType } from '../../../core/models/report.model';
import { STATUS_META } from '../../../shared/utils/status-meta';
import { injectOrgSettings } from '../../org-settings/data/org-settings.queries';
import { injectMechanics } from '../../users/data/users.queries';
import { ReportChartComponent } from '../components/report-chart/report-chart.component';
import { ReportsApi } from '../data/reports.api';
import { downloadReport } from '../data/reports.actions';
import { injectReport } from '../data/reports.queries';
import { REPORT_FORMATTERS, REPORT_TYPES } from '../report-formatters.util';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReportChartComponent,
  ],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss',
})
export class ReportsPage {
  private readonly reportsApi = inject(ReportsApi);

  readonly reportTypes = REPORT_TYPES;
  readonly statusOptions = Object.entries(STATUS_META).map(([value, meta]) => ({ value: value as JobStatus, label: meta.label }));

  readonly type = signal<ReportType>('Jobs');
  readonly from = signal<string | null>(null);
  readonly to = signal<string | null>(null);
  readonly mechanicId = signal<string | null>(null);
  readonly status = signal<JobStatus | null>(null);

  readonly orgSettingsQuery = injectOrgSettings();
  readonly mechanicsQuery = injectMechanics();

  readonly filters = computed<ReportFilters>(() => ({
    from: this.from() ?? undefined,
    to: this.to() ?? undefined,
    mechanicId: this.mechanicId() ?? undefined,
    status: this.status() ?? undefined,
  }));

  readonly reportQuery = injectReport(this.type, this.filters);

  get showMechanicFilter(): boolean {
    return this.type() === 'Jobs' || this.type() === 'MechanicProductivity';
  }

  get showStatusFilter(): boolean {
    return this.type() === 'Jobs';
  }

  get formatters() {
    return REPORT_FORMATTERS[this.type()];
  }

  formatCell(value: string | number | boolean | null, columnIndex: number): string {
    return this.formatters[columnIndex]?.(value, this.orgSettingsQuery.data()?.currencyCode) ?? String(value ?? '—');
  }

  onTypeChange(value: ReportType): void {
    this.type.set(value);
  }

  onFromChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.from.set(value || null);
  }

  onToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.to.set(value || null);
  }

  download(format: ReportExportFormat): void {
    void downloadReport(this.reportsApi, this.type(), format, this.filters());
  }
}
