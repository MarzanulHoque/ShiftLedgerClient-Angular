import { inject } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { UpdateDepartmentRequest } from '../../../core/models/department.model';
import { DepartmentsApi } from './departments.api';

const KEY = ['departments'];

export function injectCreateDepartmentMutation() {
  const api = inject(DepartmentsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (name: string) => firstValueFrom(api.createDepartment(name)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}

export function injectUpdateDepartmentMutation() {
  const api = inject(DepartmentsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: UpdateDepartmentRequest) => firstValueFrom(api.updateDepartment(request.id, request.name)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}

export function injectDeleteDepartmentMutation() {
  const api = inject(DepartmentsApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (id: string) => firstValueFrom(api.deleteDepartment(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}
