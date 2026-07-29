import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { DateOnlyPipe } from '../../../shared/utils/date.pipes';
import { formatJobNumber } from '../../../shared/utils/identifiers.util';
import { adjacentStatuses } from '../../../shared/utils/job-status-flow.util';
import { STATUS_META } from '../../../shared/utils/status-meta';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { injectMechanics } from '../../users/data/users.queries';
import { BillPanelPlaceholderComponent } from '../components/bill-panel-placeholder/bill-panel-placeholder.component';
import { EditJobDialogComponent } from '../components/edit-job-dialog/edit-job-dialog.component';
import { JobCommentsComponent } from '../components/job-comments/job-comments.component';
import { JobHistoryComponent } from '../components/job-history/job-history.component';
import { JobStatusBadgeComponent } from '../components/job-status-badge/job-status-badge.component';
import { PriorityBadgeComponent } from '../components/priority-badge/priority-badge.component';
import { injectAssignMechanicMutation, injectChangeJobStatusMutation, injectDeleteJobMutation } from '../data/jobs.mutations';
import { injectJob } from '../data/jobs.queries';

@Component({
  selector: 'app-job-detail-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    DateOnlyPipe,
    JobStatusBadgeComponent,
    PriorityBadgeComponent,
    JobCommentsComponent,
    JobHistoryComponent,
    BillPanelPlaceholderComponent,
  ],
  templateUrl: './job-detail.page.html',
  styleUrl: './job-detail.page.scss',
})
export class JobDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly session = inject(AuthSessionService);

  readonly jobId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('id') ?? '',
  });

  readonly jobQuery = injectJob(this.jobId);
  readonly mechanicsQuery = injectMechanics();
  readonly changeStatus = injectChangeJobStatusMutation(this.jobId);
  readonly assignMechanic = injectAssignMechanicMutation(this.jobId);
  readonly deleteJob = injectDeleteJobMutation();

  readonly statusMeta = STATUS_META;

  // Beyond the React app (which renders this panel unconditionally for any viewer) — a confirmed
  // improvement: the History endpoint is Admin-only per the API, so hide it for Employees too.
  readonly isAdmin = this.session.user()?.role !== 'Employee';

  jobNumber(n: number): string {
    return formatJobNumber(n);
  }

  adjacent(status: Parameters<typeof adjacentStatuses>[0]) {
    return adjacentStatuses(status);
  }

  onAssignMechanic(mechanicId: string | null): void {
    if (mechanicId) this.assignMechanic.mutate(mechanicId);
  }

  openEditDialog(): void {
    const job = this.jobQuery.data();
    if (!job) return;
    this.dialog.open(EditJobDialogComponent, { width: '520px', data: { job } });
  }

  confirmDelete(): void {
    const job = this.jobQuery.data();
    if (!job) return;

    this.dialog
      .open(ConfirmDialogComponent, {
        data: { title: 'Delete job', message: `Delete "${job.title}"? This cannot be undone.` },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteJob.mutate(
            { id: job.id, rowVersion: job.rowVersion },
            { onSuccess: () => void this.router.navigateByUrl('/jobs') },
          );
        }
      });
  }
}
