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
  // Beyond the React app's JobDto (which omits this field). Optional, not required: the live
  // ShiftLedger-API's GetJobs/GetJob/UpdateJob/DeleteJob handlers do not implement rowVersion for
  // Jobs at all (verified against the running API — no RowVersion param, no concurrency check),
  // despite the general convention described in docs/04_API_Specification.md §1. Typed as
  // optional so the client is forward-compatible if the backend adds it later, without lying
  // about what the API returns today. See docs/15_Angular_Client.md.
  rowVersion?: string;
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
  rowVersion?: string;
}
