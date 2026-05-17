import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'planfy_jwt';
  private readonly REFRESH_KEY = 'planfy_refresh';
  private readonly USER_KEY = 'planfy_user';

  // ─── Token ───────────────────────────────────────────────
  setToken(token: string): void {
    try { localStorage.setItem(this.TOKEN_KEY, token); } catch {}
  }

  getToken(): string | null {
    try { return localStorage.getItem(this.TOKEN_KEY); } catch { return null; }
  }

  setRefreshToken(token: string): void {
    try { localStorage.setItem(this.REFRESH_KEY, token); } catch {}
  }

  getRefreshToken(): string | null {
    try { return localStorage.getItem(this.REFRESH_KEY); } catch { return null; }
  }

  // ─── User ────────────────────────────────────────────────
  setUser(user: unknown): void {
    try { localStorage.setItem(this.USER_KEY, JSON.stringify(user)); } catch {}
  }

  getUser<T = unknown>(): T | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) as T : null;
    } catch { return null; }
  }

  // ─── Session ─────────────────────────────────────────────
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch {}
  }
}
