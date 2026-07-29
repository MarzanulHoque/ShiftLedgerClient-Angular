import { Component, Input } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JobDto, JobStatus } from '../../../../core/models/job.model';
import { STATUS_META } from '../../../../shared/utils/status-meta';
import { adjacentStatuses } from '../../../../shared/utils/job-status-flow.util';
import { injectChangeAnyJobStatusMutation } from '../../data/jobs.mutations';
import { JobCardComponent } from '../job-card/job-card.component';

const COLUMNS: JobStatus[] = ['Received', 'InProgress', 'Completed', 'Delivered'];

@Component({
  selector: 'app-jobs-board',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, JobCardComponent],
  templateUrl: './jobs-board.component.html',
  styleUrl: './jobs-board.component.scss',
})
export class JobsBoardComponent {
  @Input() jobs: JobDto[] = [];

  readonly columns = COLUMNS;
  readonly statusMeta = STATUS_META;

  private readonly changeStatus = injectChangeAnyJobStatusMutation();

  constructor(private readonly snackBar: MatSnackBar) {}

  jobsFor(status: JobStatus): JobDto[] {
    return this.jobs.filter((job) => job.status === status);
  }

  onDrop(event: CdkDragDrop<JobDto[], JobDto[], JobDto>): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const job = event.item.data as JobDto;
    const targetStatus = event.container.id as JobStatus;
    const { back, forward } = adjacentStatuses(job.status);

    if (targetStatus !== back && targetStatus !== forward) {
      this.snackBar.open(
        `A job moves one status at a time — drop it on ${this.statusMeta[job.status].label}'s neighboring column.`,
        'Dismiss',
        { duration: 4000 },
      );
      return;
    }

    // Deliberately does not call moveItemInArray/transferArrayItem — the source array (`jobs`)
    // is untouched, so the card visually snaps back to its column until the mutation succeeds
    // and the query cache is invalidated/refetched. No optimistic UI, matching the React app.
    this.changeStatus.mutate({ id: job.id, newStatus: targetStatus });
  }
}
