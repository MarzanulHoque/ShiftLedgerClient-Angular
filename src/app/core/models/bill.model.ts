export type LineItemType = 'Labor' | 'Part';

export interface BillSummaryDto {
  id: string;
  billNumber: number;
  serviceJobId: string;
  departmentId: string;
  isPaid: boolean;
  paidAtUtc: string | null;
  total: number;
}

export interface BillLineItemDto {
  id: string;
  type: LineItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface BillDto {
  id: string;
  billNumber: number;
  serviceJobId: string;
  isPaid: boolean;
  paidAtUtc: string | null;
  lines: BillLineItemDto[];
  total: number;
}

export interface DepartmentBillingSummaryDto {
  departmentId: string;
  departmentName: string;
  totalCount: number;
  unpaidCount: number;
  unpaidTotal: number;
  paidCount: number;
  paidTotal: number;
  grandTotal: number;
}

export interface LineItemRequest {
  type: LineItemType;
  description: string;
  quantity: number;
  unitPrice: number;
}
