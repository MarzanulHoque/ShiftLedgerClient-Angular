import { Routes } from '@angular/router';

export const jobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/jobs.page').then((m) => m.JobsPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/job-detail.page').then((m) => m.JobDetailPage),
  },
];
