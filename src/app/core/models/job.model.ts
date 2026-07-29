export type JobStatus = 'Received' | 'InProgress' | 'Completed' | 'Delivered';

export type JobPriority = 'Low' | 'Medium' | 'High';

export interface JobDto {
  id: string;
  jobNumber: number;
  departmentId: string;
  title: string;
  description: string | null;
  bikeModel: string;
  status: JobStatus;
  priority: JobPriority;
  assignedMechanicId: string | null;
  receivedDate: string;
  dueDate: string | null;
  // Beyond the React app's JobDto (which omits this despite the API's optimistic-concurrency
  // design) — a confirmed improvement so updates/deletes can surface a real 409 instead of
  // silently overwriting a stale record. See docs/15_Angular_Client.md.
  rowVersion: string;
}

export interface JobCommentDto {
  id: string;
  authorId: string;
  body: string;
  createdAtUtc: string;
}

export interface JobHistoryEntryDto {
  action: string;
  changedById: string | null;
  changedAtUtc: string;
  oldValuesJson: string | null;
  newValuesJson: string | null;
}

export interface GetJobsParams {
  status?: JobStatus;
  mechanicId?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateJobRequest {
  title: string;
  description?: string | null;
  bikeModel: string;
  priority?: JobPriority | null;
  assignedMechanicId?: string | null;
  receivedDate?: string | null;
  dueDate?: string | null;
  departmentId: string;
}

export interface UpdateJobRequest {
  id: string;
  title: string;
  description?: string | null;
  bikeModel: string;
  priority: JobPriority;
  dueDate?: string | null;
  rowVersion: string;
}
