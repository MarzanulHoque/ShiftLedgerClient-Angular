import { inject } from '@angular/core';
import { QueryClient, injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { CreateJobRequest, JobStatus, UpdateJobRequest } from '../../../core/models/job.model';
import { JobsApi } from './jobs.api';

function invalidateJob(queryClient: QueryClient, id: string): void {
  void queryClient.invalidateQueries({ queryKey: ['jobs'] });
  void queryClient.invalidateQueries({ queryKey: ['jobs', id] });
}

export function injectCreateJobMutation() {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: CreateJobRequest) => firstValueFrom(api.createJob(request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  }));
}

export function injectUpdateJobMutation(id: string) {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: UpdateJobRequest) => firstValueFrom(api.updateJob(id, request)),
    onSuccess: () => invalidateJob(queryClient, id),
  }));
}

export function injectDeleteJobMutation() {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: ({ id, rowVersion }: { id: string; rowVersion: string }) => firstValueFrom(api.deleteJob(id, rowVersion)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  }));
}

export function injectChangeJobStatusMutation(id: string) {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (newStatus: JobStatus) => firstValueFrom(api.changeJobStatus(id, newStatus)),
    onSuccess: () => invalidateJob(queryClient, id),
  }));
}

// For the board's drag-and-drop: the target job id is only known at drop time, not at
// inject-call time, so this takes {id, newStatus} per mutate() call instead of binding id upfront.
export function injectChangeAnyJobStatusMutation() {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: JobStatus }) => firstValueFrom(api.changeJobStatus(id, newStatus)),
    onSuccess: (_data: void, { id }: { id: string; newStatus: JobStatus }) => invalidateJob(queryClient, id),
  }));
}

export function injectAssignMechanicMutation(id: string) {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (mechanicId: string) => firstValueFrom(api.assignMechanic(id, mechanicId)),
    onSuccess: () => invalidateJob(queryClient, id),
  }));
}

export function injectAddJobCommentMutation(id: string) {
  const api = inject(JobsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (body: string) => firstValueFrom(api.addJobComment(id, body)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs', id, 'comments'] }),
  }));
}
