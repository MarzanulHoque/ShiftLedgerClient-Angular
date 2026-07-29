import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { DepartmentDto } from '../../../../core/models/department.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { injectDeleteDepartmentMutation } from '../../data/departments.mutations';
import { injectDepartments } from '../../data/departments.queries';
import { DepartmentFormDialogComponent } from '../department-form-dialog/department-form-dialog.component';

@Component({
  selector: 'app-departments-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './departments-table.component.html',
  styleUrl: './departments-table.component.scss',
})
export class DepartmentsTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly session = inject(AuthSessionService);

  readonly departmentsQuery = injectDepartments();
  readonly deleteDepartment = injectDeleteDepartmentMutation();

  // Beyond the React app (which renders these actions unconditionally for any admin viewer) — a
  // confirmed improvement in the same spirit as job-detail's admin-only History panel: department
  // write endpoints are SuperAdmin-only server-side (Rule RB4), so a DepartmentAdmin's click would
  // always 403. Hide rather than let them hit that.
  readonly isSuperAdmin = this.session.user()?.role === 'SuperAdmin';

  openCreateDialog(): void {
    this.dialog.open(DepartmentFormDialogComponent, { width: '420px', data: {} });
  }

  openEditDialog(department: DepartmentDto): void {
    this.dialog.open(DepartmentFormDialogComponent, { width: '420px', data: { department } });
  }

  confirmDelete(department: DepartmentDto): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: { title: 'Delete department', message: `Delete "${department.name}"? This cannot be undone.` } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.deleteDepartment.mutate(department.id);
      });
  }
}
