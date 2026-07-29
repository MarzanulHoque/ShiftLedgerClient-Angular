import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { DepartmentsApi } from './departments.api';

export function injectDepartments() {
  const api = inject(DepartmentsApi);
  return injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => firstValueFrom(api.getDepartments()),
  }));
}
