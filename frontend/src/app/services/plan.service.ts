import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  gratuito: boolean;
  precio: number;
  latitud: number;
  longitud: number;
  ciudad: { id: number; nombre: string } | null;
  categoria: { id: number; nombre: string } | null;
}

export interface SwipeFilters {
  ciudadId?: number;
  categoriaId?: number;
  gratuito?: boolean;
  precioMax?: number;
}

export interface VotesSummary {
  likes: number;
  dislikes: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.apiUrl}/plans`;

  constructor(private http: HttpClient) {}

  // ─── Planes generales ────────────────────────────────────
  getAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  getById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}`);
  }

  // ─── Swipe (requiere JWT) ────────────────────────────────
  getSwipe(filters?: SwipeFilters): Observable<Plan | { message: string }> {
    let params = new HttpParams();
    if (filters?.ciudadId) params = params.set('ciudadId', filters.ciudadId);
    if (filters?.categoriaId) params = params.set('categoriaId', filters.categoriaId);
    if (filters?.gratuito !== undefined) params = params.set('gratuito', String(filters.gratuito));
    if (filters?.precioMax) params = params.set('precioMax', filters.precioMax);
    return this.http.get<Plan | { message: string }>(`${this.apiUrl}/swipe`, { params });
  }

  getShuffle(filters?: { ciudadId?: number; categoriaId?: number; precioMax?: number }): Observable<Plan> {
    let params = new HttpParams();
    if (filters?.ciudadId) params = params.set('ciudadId', filters.ciudadId);
    if (filters?.categoriaId) params = params.set('categoriaId', filters.categoriaId);
    if (filters?.precioMax) params = params.set('precioMax', filters.precioMax);
    return this.http.get<Plan>(`${this.apiUrl}/shuffle`, { params });
  }

  getRandom(): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/random`);
  }

  // ─── Likes / Dislikes (requiere JWT) ─────────────────────
  like(planId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${planId}/like`, {}, { responseType: 'text' });
  }

  dislike(planId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${planId}/dislike`, {}, { responseType: 'text' });
  }

  removeVote(planId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${planId}/vote`, { responseType: 'text' });
  }

  getVoteStatus(planId: number): Observable<boolean | null> {
    return this.http.get<boolean | null>(`${this.apiUrl}/${planId}/vote-status`);
  }

  getVotesSummary(planId: number): Observable<VotesSummary> {
    return this.http.get<VotesSummary>(`${this.apiUrl}/${planId}/votes-summary`);
  }

  getMyLikes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me/liked`);
  }
}
