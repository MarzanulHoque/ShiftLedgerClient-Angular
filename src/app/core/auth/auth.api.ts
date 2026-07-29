import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthResult } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResult> {
    return this.http.post<AuthResult>('/auth/login', { email, password });
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>('/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>('/auth/reset-password', { token, newPassword });
  }
}
