import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { OrgSettingsApi } from './org-settings.api';

export function injectOrgSettings() {
  const api = inject(OrgSettingsApi);
  return injectQuery(() => ({
    queryKey: ['org-settings'],
    queryFn: () => firstValueFrom(api.getOrgSettings()),
    staleTime: Infinity,
  }));
}
