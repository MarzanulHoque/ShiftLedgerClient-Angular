import { Routes } from '@angular/router';

export const jobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/feature-placeholder/feature-placeholder.component').then(
        (m) => m.FeaturePlaceholderComponent,
      ),
    data: { title: 'Jobs' },
  },
];
