import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BillLineItemDto, LineItemType } from '../../../../core/models/bill.model';
import { injectAddLineItemMutation, injectUpdateLineItemMutation } from '../../data/bills.mutations';

export interface LineItemDialogData {
  jobId: string;
  billId: string;
  line?: BillLineItemDto;
}

@Component({
  selector: 'app-line-item-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './line-item-dialog.component.html',
})
export class LineItemDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<LineItemDialogComponent>);
  private readonly data = inject<LineItemDialogData>(MAT_DIALOG_DATA);

  readonly types: LineItemType[] = ['Labor', 'Part'];
  readonly isEdit = Boolean(this.data.line);

  private readonly addLineItem = injectAddLineItemMutation(signal(this.data.jobId), signal(this.data.billId));
  private readonly updateLineItem = injectUpdateLineItemMutation(signal(this.data.jobId), signal(this.data.billId));

  readonly saving = computed(() => (this.isEdit ? this.updateLineItem.isPending() : this.addLineItem.isPending()));

  readonly form = this.fb.nonNullable.group({
    type: [this.data.line?.type ?? ('Labor' as LineItemType), Validators.required],
    description: [this.data.line?.description ?? '', [Validators.required, Validators.maxLength(300)]],
    quantity: [this.data.line?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
    unitPrice: [this.data.line?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue();
    const onSuccess = { onSuccess: () => this.dialogRef.close(true) };

    if (this.isEdit && this.data.line) {
      this.updateLineItem.mutate({ lineId: this.data.line.id, request }, onSuccess);
    } else {
      this.addLineItem.mutate(request, onSuccess);
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
