import { Component, Input } from '@angular/core';

import { JobPriority } from '../../../../core/models/job.model';
import { PRIORITY_META } from '../../../../shared/utils/status-meta';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge--' + meta.tone">{{ meta.label }}</span>`,
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: JobPriority;

  get meta() {
    return PRIORITY_META[this.priority];
  }
}
