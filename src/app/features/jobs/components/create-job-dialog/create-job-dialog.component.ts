import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthSessionService } from '../../../../core/auth/auth-session.service';
import { todayDateOnly } from '../../../../shared/utils/date.util';
import { injectDepartments } from '../../../departments/data/departments.queries';
import { injectMechanics } from '../../../users/data/users.queries';
import { injectCreateJobMutation } from '../../data/jobs.mutations';

@Component({
  selector: 'app-create-job-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-job-dialog.component.html',
})
export class CreateJobDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(AuthSessionService);
  private readonly dialogRef = inject(MatDialogRef<CreateJobDialogComponent>);

  readonly departmentsQuery = injectDepartments();
  readonly mechanicsQuery = injectMechanics();
  readonly createJob = injectCreateJobMutation();

  readonly isSuperAdmin = this.session.user()?.role === 'SuperAdmin';
  readonly priorities = ['Low', 'Medium', 'High'] as const;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    bikeModel: ['', [Validators.required, Validators.maxLength(128)]],
    description: ['', [Validators.maxLength(2000)]],
    priority: ['Medium' as 'Low' | 'Medium' | 'High'],
    departmentId: [
      { value: this.isSuperAdmin ? '' : (this.session.user()?.departmentId ?? ''), disabled: !this.isSuperAdmin },
      [Validators.required],
    ],
    assignedMechanicId: [null as string | null],
    receivedDate: [todayDateOnly(), [Validators.required]],
    dueDate: [null as string | null],
  });

  private readonly departmentId = toSignal(this.form.controls.departmentId.valueChanges, {
    initialValue: this.form.controls.departmentId.value,
  });

  readonly departmentMechanics = computed(() =>
    this.mechanicsQuery.mechanics().filter((m) => m.departmentId === this.departmentId()),
  );

  constructor() {
    this.form.controls.departmentId.valueChanges.subscribe(() => {
      this.form.controls.assignedMechanicId.setValue(null);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.createJob.mutate(
      {
        title: values.title,
        bikeModel: values.bikeModel,
        description: values.description || null,
        priority: values.priority,
        departmentId: values.departmentId,
        assignedMechanicId: values.assignedMechanicId,
        receivedDate: values.receivedDate,
        dueDate: values.dueDate,
      },
      {
        onSuccess: () => this.dialogRef.close(true),
      },
    );
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
