import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { JobPriority } from '../../../core/models/job.model';
import { AuthSessionService } from '../../../core/auth/auth-session.service';
import { dueChip } from '../../../shared/utils/due-chip.util';
import { injectDepartments } from '../../departments/data/departments.queries';
import { injectMechanics } from '../../users/data/users.queries';
import { injectJobBoard } from '../data/jobs.queries';
import { CreateJobDialogComponent } from '../components/create-job-dialog/create-job-dialog.component';
import { JobsBoardComponent } from '../components/jobs-board/jobs-board.component';
import { JobsListComponent } from '../components/jobs-list/jobs-list.component';

type View = 'board' | 'list';
type DueFilter = 'overdue' | 'soon';

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    JobsBoardComponent,
    JobsListComponent,
  ],
  templateUrl: './jobs.page.html',
  styleUrl: './jobs.page.scss',
})
export class JobsPage {
  readonly view = signal<View>('board');
  readonly mechanicId = signal<string | null>(null);
  readonly departmentId = signal<string | null>(null);
  readonly priority = signal<JobPriority | null>(null);
  readonly dueFilter = signal<DueFilter | null>(null);

  readonly priorities: JobPriority[] = ['Low', 'Medium', 'High'];

  readonly isSuperAdmin: boolean;
  readonly departmentsQuery = injectDepartments();
  readonly mechanicsQuery = injectMechanics();

  private readonly mechanicIdOrUndefined = computed(() => this.mechanicId() ?? undefined);
  private readonly departmentIdOrUndefined = computed(() => this.departmentId() ?? undefined);
  readonly boardQuery = injectJobBoard(this.mechanicIdOrUndefined, this.departmentIdOrUndefined);

  readonly boardItems = computed(() => {
    let items = this.boardQuery.data()?.items ?? [];
    const priority = this.priority();
    if (priority) {
      items = items.filter((j) => j.priority === priority);
    }
    const due = this.dueFilter();
    if (due) {
      items = items.filter((j) => {
        const chip = dueChip(j.dueDate);
        return due === 'overdue' ? chip.overdue : chip.soon;
      });
    }
    return items;
  });

  constructor(
    session: AuthSessionService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.isSuperAdmin = session.user()?.role === 'SuperAdmin';

    // Deep link from the dashboard's "+ New job" quick action (/jobs?new=1).
    if (this.route.snapshot.queryParamMap.has('new')) {
      this.openCreateDialog();
      void this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }

  openCreateDialog(): void {
    this.dialog.open(CreateJobDialogComponent, { width: '520px' });
  }
}
