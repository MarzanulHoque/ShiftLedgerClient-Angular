import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import { BillSummaryDto } from '../../../core/models/bill.model';
import { PagedResult } from '../../../core/models/paged-result.model';

export interface GetBillsParams {
  isPaid?: boolean;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

// Billing (P5 equivalent) itself is a later pass — this is only the read used by the Dashboard's
// unpaid-bills/recent-payments panels. Extend this file when the full Billing slice is built.
@Injectable({ providedIn: 'root' })
export class BillsApi {
  constructor(private readonly http: HttpClient) {}

  getBills(params: GetBillsParams = {}): Observable<PagedResult<BillSummaryDto>> {
    return this.http.get<PagedResult<BillSummaryDto>>('/bills', { params: toHttpParams(params) });
  }
}
