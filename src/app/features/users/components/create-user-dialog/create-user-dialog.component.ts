import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { Role } from '../../../../core/models/auth.model';
import { injectDepartments } from '../../../departments/data/departments.queries';
import { injectCreateUserMutation } from '../../data/users.mutations';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-user-dialog.component.html',
})
export class CreateUserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly session = inject(AuthSessionService);

  readonly departmentsQuery = injectDepartments();
  readonly createUser = injectCreateUserMutation();

  readonly isSuperAdmin = this.session.user()?.role === 'SuperAdmin';
  readonly roles: Exclude<Role, 'SuperAdmin'>[] = ['Employee', 'DepartmentAdmin'];

  // Rule RB5: a DepartmentAdmin may only provision Employees into their own department.
  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [{ value: 'Employee' as Exclude<Role, 'SuperAdmin'>, disabled: !this.isSuperAdmin }, Validators.required],
    departmentId: [
      { value: this.isSuperAdmin ? '' : (this.session.user()?.departmentId ?? ''), disabled: !this.isSuperAdmin },
      Validators.required,
    ],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.createUser.mutate(values, { onSuccess: () => this.dialogRef.close(true) });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
