import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JobStatus } from '../../../../core/models/job.model';
import { DateOnlyPipe } from '../../../../shared/utils/date.pipes';
import { formatJobNumber } from '../../../../shared/utils/identifiers.util';
import { STATUS_META } from '../../../../shared/utils/status-meta';
import { injectDepartments } from '../../../departments/data/departments.queries';
import { injectMechanics } from '../../../users/data/users.queries';
import { injectJobsList } from '../../data/jobs.queries';
import { JobStatusBadgeComponent } from '../job-status-badge/job-status-badge.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';

const PAGE_SIZE = 20;
const COLUMNS = ['jobNumber', 'title', 'bikeModel', 'status', 'priority', 'mechanic', 'received', 'due'];

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DateOnlyPipe,
    JobStatusBadgeComponent,
    PriorityBadgeComponent,
  ],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.scss',
})
export class JobsListComponent {
  @Input() isSuperAdmin = false;
  @Input() mechanicId: string | null = null;
  @Input() departmentId: string | null = null;
  @Output() mechanicIdChange = new EventEmitter<string | null>();
  @Output() departmentIdChange = new EventEmitter<string | null>();

  readonly columns = COLUMNS;
  readonly statusOptions = Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label }));
  readonly pageSize = PAGE_SIZE;

  readonly status = signal<JobStatus | null>(null);
  readonly page = signal(1);

  private readonly params = computed(() => ({
    status: this.status() ?? undefined,
    mechanicId: this.mechanicId ?? undefined,
    departmentId: this.departmentId ?? undefined,
    page: this.page(),
    pageSize: PAGE_SIZE,
  }));

  readonly jobsList = injectJobsList(this.params);
  readonly departmentsQuery = injectDepartments();
  readonly mechanicsQuery = injectMechanics();

  constructor(private readonly router: Router) {}

  mechanicName(id: string | null): string {
    if (!id) return '—';
    return this.mechanicsQuery.mechanics().find((m) => m.id === id)?.fullName ?? '—';
  }

  formatJobNumber = formatJobNumber;

  onStatusChange(value: JobStatus | null): void {
    this.status.set(value);
    this.page.set(1);
  }

  onMechanicChange(value: string | null): void {
    this.mechanicIdChange.emit(value);
    this.page.set(1);
  }

  onDepartmentChange(value: string | null): void {
    this.departmentIdChange.emit(value);
    this.page.set(1);
  }

  onPageEvent(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
  }

  openJob(id: string): void {
    void this.router.navigate(['/jobs', id]);
  }
}
