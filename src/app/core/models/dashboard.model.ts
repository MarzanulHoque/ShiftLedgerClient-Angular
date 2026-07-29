import { JobStatus } from './job.model';

export interface StatusCountDto {
  status: JobStatus;
  count: number;
}

export interface MechanicWorkloadDto {
  mechanicId: string;
  mechanicName: string;
  openJobs: number;
}

export interface AdminDashboardDto {
  date: string;
  jobsReceivedToday: number;
  jobsByStatus: StatusCountDto[];
  mechanicWorkload: MechanicWorkloadDto[];
  unpaidBills: number;
  unpaidTotal: number;
  billsPaidToday: number;
  revenueToday: number;
}

export interface DepartmentDashboardMetricsDto {
  departmentId: string;
  departmentName: string;
  jobsReceivedToday: number;
  openJobs: number;
  throughputLast7Days: number;
  unpaidBills: number;
  unpaidTotal: number;
  revenueToday: number;
}
