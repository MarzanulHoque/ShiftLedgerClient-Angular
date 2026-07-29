import { computed, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { UsersApi } from './users.api';

export function injectUsers() {
  const api = inject(UsersApi);
  return injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => firstValueFrom(api.getUsers()),
  }));
}

export function injectMechanics() {
  const users = injectUsers();
  const mechanics = computed(() => users.data()?.filter((u) => u.role === 'Employee' && u.isActive) ?? []);
  return { users, mechanics };
}
