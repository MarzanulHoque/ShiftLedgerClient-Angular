import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { QueryClient, provideTanStackQuery } from '@tanstack/angular-query-experimental';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { API_BASE_URL, HUB_URL } from './core/http/api-config.token';
import { apiPrefixInterceptor } from './core/http/api-prefix.interceptor';
import { authTokenInterceptor } from './core/http/auth-token.interceptor';
import { refreshInterceptor } from './core/http/refresh.interceptor';
import { concurrencyInterceptor } from './core/http/concurrency.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: HUB_URL, useValue: environment.hubUrl },
    provideHttpClient(
      withInterceptors([apiPrefixInterceptor, authTokenInterceptor, refreshInterceptor, concurrencyInterceptor]),
    ),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      }),
    ),
  ]
};
