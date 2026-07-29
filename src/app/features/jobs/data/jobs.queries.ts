import { Signal, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { GetJobsParams } from '../../../core/models/job.model';
import { JobsApi } from './jobs.api';

export function injectJobBoard(mechanicId: Signal<string | undefined>, departmentId: Signal<string | undefined>) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['jobs', 'board', mechanicId(), departmentId()],
    queryFn: () => firstValueFrom(api.getJobs({ mechanicId: mechanicId(), departmentId: departmentId(), pageSize: 100 })),
  }));
}

export function injectJobsList(params: Signal<GetJobsParams>) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['jobs', 'list', params()],
    queryFn: () => firstValueFrom(api.getJobs(params())),
  }));
}

export function injectJob(id: Signal<string>) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['jobs', id()],
    queryFn: () => firstValueFrom(api.getJob(id())),
    enabled: Boolean(id()),
  }));
}

export function injectJobComments(id: Signal<string>) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['jobs', id(), 'comments'],
    queryFn: () => firstValueFrom(api.getJobComments(id())),
    enabled: Boolean(id()),
  }));
}

export function injectJobHistory(id: Signal<string>) {
  const api = inject(JobsApi);
  return injectQuery(() => ({
    queryKey: ['jobs', id(), 'history'],
    queryFn: () => firstValueFrom(api.getJobHistory(id())),
    enabled: Boolean(id()),
  }));
}
