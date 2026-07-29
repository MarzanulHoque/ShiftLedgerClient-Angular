import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap, throwError } from 'rxjs';

import { API_BASE_URL } from '../http/api-config.token';
import { AuthResult } from '../models/auth.model';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private refreshing$: Observable<string> | null = null;
  private readonly plainHttp: HttpClient;

  constructor(
    backend: HttpBackend,
    private readonly session: AuthSessionService,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {
    // A plain, non-intercepted HttpClient (built from HttpBackend directly) — the equivalent of
    // React's bare `axios.post` for /auth/refresh, so this call never recurses through
    // authTokenInterceptor/refreshInterceptor.
    this.plainHttp = new HttpClient(backend);
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.session.refreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    if (!this.refreshing$) {
      this.refreshing$ = this.plainHttp.post<AuthResult>(`${this.baseUrl}/auth/refresh`, { refreshToken }).pipe(
        tap((result) => this.session.setSession(result.accessToken, result.refreshToken)),
        map((result) => result.accessToken),
        finalize(() => {
          this.refreshing$ = null;
        }),
        shareReplay(1),
      );
    }

    return this.refreshing$;
  }
}
