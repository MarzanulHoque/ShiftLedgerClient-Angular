import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { JobDto } from '../../../../core/models/job.model';
import { dueChip } from '../../../../shared/utils/due-chip.util';
import { formatJobNumber } from '../../../../shared/utils/identifiers.util';
import { initials } from '../../../../shared/utils/initials.util';
import { adjacentStatuses } from '../../../../shared/utils/job-status-flow.util';
import { injectMechanics } from '../../../users/data/users.queries';
import { injectChangeAnyJobStatusMutation } from '../../data/jobs.mutations';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent {
  @Input({ required: true }) job!: JobDto;

  readonly mechanicsQuery = injectMechanics();
  private readonly changeStatus = injectChangeAnyJobStatusMutation();

  constructor(private readonly router: Router) {}

  get due() {
    return dueChip(this.job.dueDate);
  }

  get adjacent() {
    return adjacentStatuses(this.job.status);
  }

  get mechanicName(): string | undefined {
    return this.mechanicsQuery.mechanics().find((m) => m.id === this.job.assignedMechanicId)?.fullName;
  }

  jobNumber(): string {
    return formatJobNumber(this.job.jobNumber);
  }

  initialsFor(name: string): string {
    return initials(name);
  }

  openJob(): void {
    void this.router.navigate(['/jobs', this.job.id]);
  }

  moveBack(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const back = this.adjacent.back;
    if (back) this.changeStatus.mutate({ id: this.job.id, newStatus: back });
  }

  moveForward(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const forward = this.adjacent.forward;
    if (forward) this.changeStatus.mutate({ id: this.job.id, newStatus: forward });
  }
}
