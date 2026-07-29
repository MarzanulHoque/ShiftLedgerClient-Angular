import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DepartmentDto } from '../../../../core/models/department.model';
import { injectCreateDepartmentMutation, injectUpdateDepartmentMutation } from '../../data/departments.mutations';

export interface DepartmentFormDialogData {
  department?: DepartmentDto;
}

@Component({
  selector: 'app-department-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './department-form-dialog.component.html',
})
export class DepartmentFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<DepartmentFormDialogComponent>);
  private readonly data = inject<DepartmentFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = Boolean(this.data.department);
  readonly createDepartment = injectCreateDepartmentMutation();
  readonly updateDepartment = injectUpdateDepartmentMutation();
  readonly saving = computed(() => (this.isEdit ? this.updateDepartment.isPending() : this.createDepartment.isPending()));

  readonly form = this.fb.nonNullable.group({
    name: [this.data.department?.name ?? '', [Validators.required, Validators.maxLength(128)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();
    const onSuccess = { onSuccess: () => this.dialogRef.close(true) };

    if (this.isEdit && this.data.department) {
      this.updateDepartment.mutate({ id: this.data.department.id, name }, onSuccess);
    } else {
      this.createDepartment.mutate(name, onSuccess);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
