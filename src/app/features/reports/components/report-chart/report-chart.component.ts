import { Component, Input } from '@angular/core';

import { JobStatus } from '../../../../core/models/job.model';
import { ReportData, ReportType } from '../../../../core/models/report.model';
import { AreaChartComponent, AreaChartPoint } from '../../../../shared/components/area-chart/area-chart.component';
import { BarChartComponent, BarItem, BarLegendEntry } from '../../../../shared/components/bar-chart/bar-chart.component';
import { CHART_COLOR, STATUS_CHART_COLOR } from '../../../../shared/utils/chart-colors.util';
import { formatDate } from '../../../../shared/utils/date.util';
import { formatMoney } from '../../../../shared/utils/money.util';
import { STATUS_META } from '../../../../shared/utils/status-meta';

const JOB_STATUS_ORDER: JobStatus[] = ['Received', 'InProgress', 'Completed', 'Delivered'];
const UNPAID_BILLS_TOP_N = 10;

@Component({
  selector: 'app-report-chart',
  standalone: true,
  imports: [AreaChartComponent, BarChartComponent],
  templateUrl: './report-chart.component.html',
  styleUrl: './report-chart.component.scss',
})
export class ReportChartComponent {
  @Input({ required: true }) type!: ReportType;
  @Input({ required: true }) report!: ReportData;
  @Input() currencyCode?: string;

  money = (amount: number): string => formatMoney(amount, this.currencyCode);
  count = (value: number): string => String(value);
  dateLabel = (isoDate: string): string => formatDate(isoDate, 'MMM D');

  get hasData(): boolean {
    return this.report.rows.length > 0;
  }

  // Jobs report: one bar per status, in a fixed order even at zero — same reasoning as the
  // dashboard's status donut (a quiet range would otherwise render an empty chart).
  get jobsByStatus(): BarItem[] {
    return JOB_STATUS_ORDER.map((status) => ({
      label: STATUS_META[status].label,
      segments: [{ value: this.report.rows.filter((r) => r[2] === status).length, color: STATUS_CHART_COLOR[status] }],
    }));
  }

  // Revenue report: same visual language as the dashboard's 14-day trend, just driven by
  // whatever date range the report filters resolve to instead of a fixed window.
  get revenuePoints(): AreaChartPoint[] {
    return this.report.rows.map((row) => ({ label: String(row[0]), value: Number(row[2]) || 0 }));
  }

  // Unpaid bills report: magnitude ranking, one hue (danger — money owed), sorted high to low,
  // capped at the top 10 so the chart stays readable (the full list is always in the table below).
  get unpaidBillsTop(): BarItem[] {
    return this.unpaidBillsSorted.slice(0, UNPAID_BILLS_TOP_N).map((row) => ({
      label: String(row[0]),
      segments: [{ value: Number(row[3]) || 0, color: CHART_COLOR.danger }],
    }));
  }

  get unpaidBillsSorted(): ReportData['rows'] {
    return [...this.report.rows].sort((a, b) => (Number(b[3]) || 0) - (Number(a[3]) || 0));
  }

  get unpaidBillsChartTitle(): string {
    const total = this.report.rows.length;
    return total > UNPAID_BILLS_TOP_N ? `Outstanding by job — top ${UNPAID_BILLS_TOP_N} of ${total}` : 'Outstanding by job';
  }

  // Billing history report: billed total per day, split paid vs unpaid.
  get billingHistoryByDay(): BarItem[] {
    const byDate = new Map<string, { paid: number; unpaid: number }>();
    for (const row of this.report.rows) {
      const date = String(row[2]);
      const total = Number(row[3]) || 0;
      const entry = byDate.get(date) ?? { paid: 0, unpaid: 0 };
      if (row[4] === 'Paid') entry.paid += total;
      else entry.unpaid += total;
      byDate.set(date, entry);
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, { paid, unpaid }]) => ({
        label: this.dateLabel(date),
        segments: [
          { value: unpaid, color: CHART_COLOR.danger },
          { value: paid, color: CHART_COLOR.success },
        ],
      }));
  }

  readonly billingHistoryLegend: BarLegendEntry[] = [
    { label: 'Unpaid', color: CHART_COLOR.danger },
    { label: 'Paid', color: CHART_COLOR.success },
  ];

  // Mechanic productivity report: per-mechanic stacked bar (Open -> Completed -> Delivered reads
  // as a progression, ending capped on the "fully done" segment).
  get mechanicProductivity(): BarItem[] {
    return this.report.rows.map((row) => ({
      label: String(row[0]),
      segments: [
        { value: Number(row[4]) || 0, color: CHART_COLOR.steel },
        { value: Number(row[2]) || 0, color: CHART_COLOR.success },
        { value: Number(row[3]) || 0, color: CHART_COLOR.slateDark },
      ],
    }));
  }

  readonly mechanicProductivityLegend: BarLegendEntry[] = [
    { label: 'Open', color: CHART_COLOR.steel },
    { label: 'Completed', color: CHART_COLOR.success },
    { label: 'Delivered', color: CHART_COLOR.slateDark },
  ];
}
