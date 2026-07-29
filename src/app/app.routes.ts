import { Routes } from '@angular/router';

import { requireAuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [requireAuthGuard],
    loadComponent: () => import('./shared/components/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard.page').then((m) => m.DashboardPage),
        data: { title: 'Dashboard' },
      },
      {
        path: 'jobs',
        loadChildren: () => import('./features/jobs/jobs.routes').then((m) => m.jobsRoutes),
      },
      {
        path: 'bills',
        loadComponent: () =>
          import('./shared/components/feature-placeholder/feature-placeholder.component').then(
            (m) => m.FeaturePlaceholderComponent,
          ),
        data: { title: 'Billing' },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./shared/components/feature-placeholder/feature-placeholder.component').then(
            (m) => m.FeaturePlaceholderComponent,
          ),
        data: { title: 'Reports' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./shared/components/feature-placeholder/feature-placeholder.component').then(
            (m) => m.FeaturePlaceholderComponent,
          ),
        data: { title: 'Users & Org' },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
