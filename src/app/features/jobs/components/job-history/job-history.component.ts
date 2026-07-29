import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { UtcDateTimePipe } from '../../../../shared/utils/date.pipes';
import { injectUsers } from '../../../users/data/users.queries';
import { injectJobHistory } from '../../data/jobs.queries';

@Component({
  selector: 'app-job-history',
  standalone: true,
  imports: [MatCardModule, UtcDateTimePipe],
  templateUrl: './job-history.component.html',
})
export class JobHistoryComponent {
  readonly jobId = input.required<string>();

  readonly usersQuery = injectUsers();
  readonly historyQuery = injectJobHistory(this.jobId);

  changedByName(changedById: string | null): string {
    if (!changedById) return 'System';
    return this.usersQuery.data()?.find((u) => u.id === changedById)?.fullName ?? 'System';
  }
}
