import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { JobDto } from '../../../../core/models/job.model';
import { injectUpdateJobMutation } from '../../data/jobs.mutations';

export interface EditJobDialogData {
  job: JobDto;
}

@Component({
  selector: 'app-edit-job-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './edit-job-dialog.component.html',
})
export class EditJobDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditJobDialogComponent>);
  private readonly data = inject<EditJobDialogData>(MAT_DIALOG_DATA);

  readonly priorities = ['Low', 'Medium', 'High'] as const;
  readonly updateJob = injectUpdateJobMutation(signal(this.data.job.id));

  readonly form = this.fb.nonNullable.group({
    title: [this.data.job.title, [Validators.required, Validators.maxLength(200)]],
    bikeModel: [this.data.job.bikeModel, [Validators.required, Validators.maxLength(128)]],
    description: [this.data.job.description ?? '', [Validators.maxLength(2000)]],
    priority: [this.data.job.priority],
    dueDate: [this.data.job.dueDate as string | null],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.updateJob.mutate(
      {
        id: this.data.job.id,
        title: values.title,
        bikeModel: values.bikeModel,
        description: values.description || null,
        priority: values.priority,
        dueDate: values.dueDate,
        rowVersion: this.data.job.rowVersion,
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
