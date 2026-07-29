import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { Role } from '../../../../core/models/auth.model';
import { UserDto } from '../../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { injectDepartments } from '../../../departments/data/departments.queries';
import { injectDeleteUserMutation } from '../../data/users.mutations';
import { injectUsers } from '../../data/users.queries';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

const ROLE_TONE: Record<Role, string> = {
  SuperAdmin: 'brand',
  DepartmentAdmin: 'steel',
  Employee: 'neutral',
};

const ROLE_LABEL: Record<Role, string> = {
  SuperAdmin: 'Super Admin',
  DepartmentAdmin: 'Department Admin',
  Employee: 'Employee',
};

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly session = inject(AuthSessionService);

  readonly usersQuery = injectUsers();
  readonly departmentsQuery = injectDepartments();
  readonly deleteUser = injectDeleteUserMutation();

  readonly roleTone = ROLE_TONE;
  readonly roleLabel = ROLE_LABEL;

  departmentName(id: string | null): string {
    if (!id) return '—';
    return this.departmentsQuery.data()?.find((d) => d.id === id)?.name ?? '—';
  }

  // Mirrors the server's RB1/RB5 checks (UpdateUser.cs/DeleteUser.cs): the Super Admin row is
  // never editable/deletable, and a DepartmentAdmin can only manage Employees.
  canManage(user: UserDto): boolean {
    const currentUser = this.session.user();
    return user.role !== 'SuperAdmin' && (currentUser?.role === 'SuperAdmin' || user.role === 'Employee');
  }

  openCreateDialog(): void {
    this.dialog.open(CreateUserDialogComponent, { width: '480px' });
  }

  openEditDialog(user: UserDto): void {
    this.dialog.open(EditUserDialogComponent, { width: '480px', data: { user } });
  }

  confirmDelete(user: UserDto): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: { title: 'Delete user', message: `Delete "${user.fullName}"? This cannot be undone.` } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.deleteUser.mutate(user.id);
      });
  }
}
