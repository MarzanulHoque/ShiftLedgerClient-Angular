import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { BillLineItemDto } from '../../../../core/models/bill.model';
import { UtcDateTimePipe } from '../../../../shared/utils/date.pipes';
import { formatBillNumber } from '../../../../shared/utils/identifiers.util';
import { formatMoney } from '../../../../shared/utils/money.util';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { injectOrgSettings } from '../../../org-settings/data/org-settings.queries';
import { BillsApi } from '../../data/bills.api';
import {
  downloadInvoice,
  injectCreateBillMutation,
  injectDeleteLineItemMutation,
  injectSetBillPaidMutation,
} from '../../data/bills.mutations';
import { injectJobBill } from '../../data/bills.queries';
import { LineItemDialogComponent } from '../line-item-dialog/line-item-dialog.component';

@Component({
  selector: 'app-bill-panel',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, UtcDateTimePipe],
  templateUrl: './bill-panel.component.html',
  styleUrl: './bill-panel.component.scss',
})
export class BillPanelComponent {
  readonly jobId = input.required<string>();

  private readonly dialog = inject(MatDialog);
  private readonly billsApi = inject(BillsApi);

  readonly billQuery = injectJobBill(this.jobId);
  readonly orgSettingsQuery = injectOrgSettings();
  readonly createBill = injectCreateBillMutation(this.jobId);

  private readonly billId = computed(() => this.billQuery.data()?.id ?? '');
  readonly deleteLineItem = injectDeleteLineItemMutation(this.jobId, this.billId);
  readonly setBillPaid = injectSetBillPaidMutation(this.jobId, this.billId);

  readonly formatBillNumber = formatBillNumber;

  money(amount: number): string {
    return formatMoney(amount, this.orgSettingsQuery.data()?.currencyCode);
  }

  startBill(): void {
    this.createBill.mutate();
  }

  openAddLineDialog(): void {
    const bill = this.billQuery.data();
    if (!bill) return;
    this.dialog.open(LineItemDialogComponent, { width: '480px', data: { jobId: this.jobId(), billId: bill.id } });
  }

  openEditLineDialog(line: BillLineItemDto): void {
    const bill = this.billQuery.data();
    if (!bill) return;
    this.dialog.open(LineItemDialogComponent, { width: '480px', data: { jobId: this.jobId(), billId: bill.id, line } });
  }

  confirmDeleteLine(line: BillLineItemDto): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: { title: 'Delete line item', message: `Delete "${line.description}"?` } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.deleteLineItem.mutate(line.id);
      });
  }

  confirmSetPaid(next: boolean): void {
    if (!next) {
      this.setBillPaid.mutate(false);
      return;
    }
    const bill = this.billQuery.data();
    if (!bill) return;
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Mark bill paid',
          message: `Mark this bill as paid for ${this.money(bill.total)}? Line items lock once paid.`,
          confirmLabel: 'Mark paid',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.setBillPaid.mutate(true);
      });
  }

  download(): void {
    const bill = this.billQuery.data();
    if (!bill) return;
    void downloadInvoice(this.billsApi, bill.id);
  }
}
