import { Signal, inject } from '@angular/core';
import { QueryClient, injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { LineItemRequest } from '../../../core/models/bill.model';
import { BillsApi } from './bills.api';

function invalidateBill(queryClient: QueryClient, jobId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['bill', jobId] });
  void queryClient.invalidateQueries({ queryKey: ['bills'] });
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
}

export function injectCreateBillMutation(jobId: Signal<string>) {
  const api = inject(BillsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: () => firstValueFrom(api.createBill(jobId())),
    onSuccess: () => invalidateBill(queryClient, jobId()),
  }));
}

export function injectAddLineItemMutation(jobId: Signal<string>, billId: Signal<string>) {
  const api = inject(BillsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: LineItemRequest) => firstValueFrom(api.addLineItem(billId(), request)),
    onSuccess: () => invalidateBill(queryClient, jobId()),
  }));
}

export function injectUpdateLineItemMutation(jobId: Signal<string>, billId: Signal<string>) {
  const api = inject(BillsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: ({ lineId, request }: { lineId: string; request: LineItemRequest }) =>
      firstValueFrom(api.updateLineItem(billId(), lineId, request)),
    onSuccess: () => invalidateBill(queryClient, jobId()),
  }));
}

export function injectDeleteLineItemMutation(jobId: Signal<string>, billId: Signal<string>) {
  const api = inject(BillsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (lineId: string) => firstValueFrom(api.deleteLineItem(billId(), lineId)),
    onSuccess: () => invalidateBill(queryClient, jobId()),
  }));
}

export function injectSetBillPaidMutation(jobId: Signal<string>, billId: Signal<string>) {
  const api = inject(BillsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (isPaid: boolean) => firstValueFrom(api.setBillPaid(billId(), isPaid)),
    onSuccess: () => invalidateBill(queryClient, jobId()),
  }));
}

// Fire-and-forget browser download, not cached data — a plain function (matching React's
// api/bills.ts downloadInvoice) rather than a mutation.
export async function downloadInvoice(api: BillsApi, billId: string): Promise<void> {
  const blob = await firstValueFrom(api.getInvoice(billId));
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${billId.slice(0, 8)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
