import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  role: string;
}

export interface JwtAuthResponse {
  token: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  login(credentials: LoginRequest): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.persistSession(res))
    );
  }

  register(data: RegisterRequest): Observable<JwtAuthResponse> {
    return this.http.post<JwtAuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.persistSession(res))
    );
  }

  logout(): void {
    this.storage.clearAll();
    this.router.navigate(['/login']);
  }

  // ─── Sesión ──────────────────────────────────────────────
  isLoggedIn(): boolean {
    const token = this.storage.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    const payload = this.parseJwt(token);
    if (!payload?.exp) return false; // sin exp → no podemos saber, asumimos válido
    // exp está en segundos; Date.now() en ms
    return payload.exp * 1000 < Date.now();
  }

  parseJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      return JSON.parse(atob(padded)) as JwtPayload;
    } catch {
      return null;
    }
  }

  getCurrentPayload(): JwtPayload | null {
    const token = this.storage.getToken();
    return token ? this.parseJwt(token) : null;
  }

  getCurrentUserStorageKey(): string {
    const email = this.getCurrentPayload()?.sub;
    return email ? encodeURIComponent(email.toLowerCase()) : 'anonymous';
  }

  private persistSession(res: JwtAuthResponse): void {
    if (res?.token) {
      this.storage.setToken(res.token);
      // Verificación defensiva: si localStorage falló (p. ej. modo incógnito),
      // al menos el token queda accesible vía getCurrentPayload durante la sesión
      if (!this.storage.getToken()) {
        console.error('[auth] no se pudo persistir el token en localStorage');
      }
    }
    if (res?.refreshToken) this.storage.setRefreshToken(res.refreshToken);
  }
}
