import { Component, Input } from '@angular/core';

import { JobStatus } from '../../../../core/models/job.model';
import { STATUS_META } from '../../../../shared/utils/status-meta';

@Component({
  selector: 'app-job-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge--' + meta.tone">{{ meta.label }}</span>`,
})
export class JobStatusBadgeComponent {
  @Input({ required: true }) status!: JobStatus;

  get meta() {
    return STATUS_META[this.status];
  }
}
