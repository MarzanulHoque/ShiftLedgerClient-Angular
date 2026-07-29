import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { StatTileComponent } from '../../dashboard/components/stat-tile/stat-tile.component';
import { UtcDateTimePipe } from '../../../shared/utils/date.pipes';
import { formatBillNumber, formatJobNumber } from '../../../shared/utils/identifiers.util';
import { formatMoney } from '../../../shared/utils/money.util';
import { injectDepartments } from '../../departments/data/departments.queries';
import { injectOrgSettings } from '../../org-settings/data/org-settings.queries';
import { AllBillsFilter, BILLS_PAGE_SIZE, injectAllBills, injectBillingSummary } from '../data/bills.queries';

type Filter = 'all' | 'unpaid' | 'paid';

const COLUMNS_SUPERADMIN = ['billNumber', 'job', 'bikeModel', 'department', 'total', 'status', 'paidAt'];
const COLUMNS_ADMIN = ['billNumber', 'job', 'bikeModel', 'total', 'status', 'paidAt'];

@Component({
  selector: 'app-bills-page',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    StatTileComponent,
    UtcDateTimePipe,
  ],
  templateUrl: './bills.page.html',
  styleUrl: './bills.page.scss',
})
export class BillsPage {
  private readonly router = inject(Router);
  private readonly session = inject(AuthSessionService);

  readonly filter = signal<Filter>('all');
  readonly departmentId = signal<string | null>(null);
  readonly page = signal(1);

  readonly isSuperAdmin = this.session.user()?.role === 'SuperAdmin';
  readonly pageSize = BILLS_PAGE_SIZE;
  readonly columns = this.isSuperAdmin ? COLUMNS_SUPERADMIN : COLUMNS_ADMIN;

  readonly departmentsQuery = injectDepartments();
  readonly orgSettingsQuery = injectOrgSettings();
  readonly summaryQuery = injectBillingSummary();

  private readonly filterParams = computed<AllBillsFilter>(() => ({
    isPaid: this.filter() === 'all' ? undefined : this.filter() === 'paid',
    departmentId: this.departmentId() ?? undefined,
    page: this.page(),
  }));

  readonly billsQuery = injectAllBills(this.filterParams);

  readonly formatBillNumber = formatBillNumber;
  readonly formatJobNumber = formatJobNumber;

  money(amount: number): string {
    return formatMoney(amount, this.orgSettingsQuery.data()?.currencyCode);
  }

  departmentName(id: string): string {
    return this.departmentsQuery.data()?.find((d) => d.id === id)?.name ?? '—';
  }

  // Rule BL2: the top tiles always come from the department roll-up (not a global dashboard
  // query), so they can never drift from the department scope the bill list itself honors —
  // narrowed to the selected department when one is picked, summed across all otherwise.
  private get scopedSummary() {
    const summary = this.summaryQuery.data();
    const departmentId = this.departmentId();
    if (!summary) return undefined;
    return departmentId ? summary.filter((d) => d.departmentId === departmentId) : summary;
  }

  get unpaidTotal(): number {
    return this.scopedSummary?.reduce((sum, d) => sum + d.unpaidTotal, 0) ?? 0;
  }

  get paidTotal(): number {
    return this.scopedSummary?.reduce((sum, d) => sum + d.paidTotal, 0) ?? 0;
  }

  get billsLabel(): string {
    const filter = this.filter();
    return filter === 'all' ? 'Total bills' : filter === 'paid' ? 'Paid bills' : 'Unpaid bills';
  }

  sumField(field: 'totalCount' | 'unpaidTotal' | 'paidTotal' | 'grandTotal'): number {
    return (this.summaryQuery.data() ?? []).reduce((sum, d) => sum + d[field], 0);
  }

  onFilterChange(value: Filter): void {
    this.filter.set(value);
    this.page.set(1);
  }

  onDepartmentChange(value: string | null): void {
    this.departmentId.set(value);
    this.page.set(1);
  }

  onPageEvent(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  openJob(jobId: string, jobDeleted: boolean): void {
    if (jobDeleted) return;
    void this.router.navigate(['/jobs', jobId]);
  }
}
