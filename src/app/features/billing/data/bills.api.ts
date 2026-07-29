import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { BillDto, BillSummaryDto, DepartmentBillingSummaryDto, LineItemRequest } from '../../../core/models/bill.model';
import { PagedResult } from '../../../core/models/paged-result.model';

export interface GetBillsParams {
  isPaid?: boolean;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class BillsApi {
  constructor(private readonly http: HttpClient) {}

  getBills(params: GetBillsParams = {}): Observable<PagedResult<BillSummaryDto>> {
    return this.http.get<PagedResult<BillSummaryDto>>('/bills', { params: toHttpParams(params) });
  }

  getBillingSummary(): Observable<DepartmentBillingSummaryDto[]> {
    return this.http.get<DepartmentBillingSummaryDto[]>('/bills/department-summary');
  }

  // A job with no bill yet is a normal state (BillPanel shows "start bill"), not an error — the
  // 404 the API returns for it is mapped to null here, same as JobsApi.getJobSummary's 404 mapping.
  getJobBill(jobId: string): Observable<BillDto | null> {
    return this.http.get<BillDto>(`/jobs/${jobId}/bill`).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }

  createBill(jobId: string): Observable<string> {
    return this.http.post<string>(`/jobs/${jobId}/bill`, {});
  }

  addLineItem(billId: string, request: LineItemRequest): Observable<string> {
    return this.http.post<string>(`/bills/${billId}/line-items`, request);
  }

  updateLineItem(billId: string, lineId: string, request: LineItemRequest): Observable<void> {
    return this.http.put<void>(`/bills/${billId}/line-items/${lineId}`, request);
  }

  deleteLineItem(billId: string, lineId: string): Observable<void> {
    return this.http.delete<void>(`/bills/${billId}/line-items/${lineId}`);
  }

  setBillPaid(billId: string, isPaid: boolean): Observable<void> {
    return this.http.patch<void>(`/bills/${billId}/pay`, { isPaid });
  }

  getInvoice(billId: string): Observable<Blob> {
    return this.http.get(`/bills/${billId}/invoice`, { responseType: 'blob' });
  }
}
