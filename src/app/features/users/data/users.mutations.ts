import { inject } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { CreateUserRequest, UpdateUserRequest } from '../../../core/models/user.model';
import { UsersApi } from './users.api';

const KEY = ['users'];

export function injectCreateUserMutation() {
  const api = inject(UsersApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: CreateUserRequest) => firstValueFrom(api.createUser(request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}

export function injectUpdateUserMutation() {
  const api = inject(UsersApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (request: UpdateUserRequest) => firstValueFrom(api.updateUser(request.id, request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}

export function injectDeleteUserMutation() {
  const api = inject(UsersApi);
  const queryClient = injectQueryClient();
  return injectMutation(() => ({
    mutationFn: (id: string) => firstValueFrom(api.deleteUser(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  }));
}
