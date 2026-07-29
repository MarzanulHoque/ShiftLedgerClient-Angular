import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { Role } from '../../../../core/models/auth.model';
import { UserDto } from '../../../../core/models/user.model';
import { injectDepartments } from '../../../departments/data/departments.queries';
import { injectUpdateUserMutation } from '../../data/users.mutations';

export interface EditUserDialogData {
  user: UserDto;
}

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
})
export class EditUserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  private readonly session = inject(AuthSessionService);
  private readonly data = inject<EditUserDialogData>(MAT_DIALOG_DATA);

  readonly user = this.data.user;
  readonly departmentsQuery = injectDepartments();
  readonly updateUser = injectUpdateUserMutation();

  readonly isSuperAdmin = this.session.user()?.role === 'SuperAdmin';
  readonly roles: Exclude<Role, 'SuperAdmin'>[] = ['Employee', 'DepartmentAdmin'];

  readonly form = this.fb.nonNullable.group({
    fullName: [this.user.fullName, [Validators.required, Validators.maxLength(200)]],
    role: [
      { value: (this.user.role === 'SuperAdmin' ? 'DepartmentAdmin' : this.user.role) as Exclude<Role, 'SuperAdmin'>, disabled: !this.isSuperAdmin },
      Validators.required,
    ],
    departmentId: [{ value: this.user.departmentId ?? '', disabled: !this.isSuperAdmin }, Validators.required],
    isActive: [this.user.isActive],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.updateUser.mutate({ id: this.user.id, ...values }, { onSuccess: () => this.dialogRef.close(true) });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
