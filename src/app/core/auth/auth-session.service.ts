import { Injectable, computed, effect, signal } from '@angular/core';

import { decodeAccessToken } from './jwt.util';
import { AuthUser } from '../models/auth.model';

const STORAGE_KEY = 'shiftledger-auth';

interface StoredSession {
  accessToken: string | null;
  refreshToken: string | null;
}

function readStoredSession(): StoredSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { accessToken: null, refreshToken: null };
    }
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    return { accessToken: parsed.accessToken ?? null, refreshToken: parsed.refreshToken ?? null };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly initial = readStoredSession();

  readonly accessToken = signal<string | null>(this.initial.accessToken);
  readonly refreshToken = signal<string | null>(this.initial.refreshToken);

  readonly user = computed<AuthUser | null>(() => {
    const token = this.accessToken();
    return token ? decodeAccessToken(token) : null;
  });

  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  constructor() {
    effect(() => {
      const value: StoredSession = { accessToken: this.accessToken(), refreshToken: this.refreshToken() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  setSession(accessToken: string, refreshToken: string): void {
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }
}
