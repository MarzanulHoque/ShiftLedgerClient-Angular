export interface BillSummaryDto {
  id: string;
  billNumber: number;
  serviceJobId: string;
  departmentId: string;
  isPaid: boolean;
  paidAtUtc: string | null;
  total: number;
}
