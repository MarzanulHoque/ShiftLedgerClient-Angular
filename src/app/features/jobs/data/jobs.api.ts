import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { toHttpParams } from '../../../core/http/http-params.util';
import {
  CreateJobRequest,
  GetJobsParams,
  JobCommentDto,
  JobDto,
  JobHistoryEntryDto,
  JobStatus,
  UpdateJobRequest,
} from '../../../core/models/job.model';
import { PagedResult } from '../../../core/models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class JobsApi {
  constructor(private readonly http: HttpClient) {}

  getJobs(params: GetJobsParams = {}): Observable<PagedResult<JobDto>> {
    return this.http.get<PagedResult<JobDto>>('/jobs', { params: toHttpParams(params) });
  }

  getJob(id: string): Observable<JobDto> {
    return this.http.get<JobDto>(`/jobs/${id}`);
  }

  // A job with a paid bill can never be deleted (see ShiftLedger-API DeleteJob.cs), so in practice
  // this 404 path only fires for pre-existing orphans from before that constraint existed. Kept as
  // a safety net so a join back to a job's title/bikeModel/number can't take the whole list down.
  getJobSummary(id: string): Observable<Pick<JobDto, 'title' | 'bikeModel' | 'jobNumber'> & { deleted: boolean }> {
    return this.getJob(id).pipe(
      map((job) => ({ title: job.title, bikeModel: job.bikeModel, jobNumber: job.jobNumber, deleted: false })),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of({ title: '(deleted job)', bikeModel: '—', jobNumber: 0, deleted: true });
        }
        return throwError(() => error);
      }),
    );
  }

  createJob(request: CreateJobRequest): Observable<string> {
    return this.http.post<string>('/jobs', request);
  }

  updateJob(id: string, request: UpdateJobRequest): Observable<void> {
    return this.http.put<void>(`/jobs/${id}`, request);
  }

  deleteJob(id: string, rowVersion: string): Observable<void> {
    return this.http.delete<void>(`/jobs/${id}`, { body: { rowVersion } });
  }

  changeJobStatus(id: string, newStatus: JobStatus): Observable<void> {
    return this.http.patch<void>(`/jobs/${id}/status`, { newStatus });
  }

  assignMechanic(id: string, mechanicId: string): Observable<void> {
    return this.http.patch<void>(`/jobs/${id}/assign`, { mechanicId });
  }

  getJobComments(id: string): Observable<JobCommentDto[]> {
    return this.http.get<JobCommentDto[]>(`/jobs/${id}/comments`);
  }

  addJobComment(id: string, body: string): Observable<string> {
    return this.http.post<string>(`/jobs/${id}/comments`, { body });
  }

  getJobHistory(id: string): Observable<JobHistoryEntryDto[]> {
    return this.http.get<JobHistoryEntryDto[]>(`/jobs/${id}/history`);
  }
}
