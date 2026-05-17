import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, ReplaySubject, of, tap, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Ciudad { id: number; nombre: string; }
export interface Categoria { id: number; nombre: string; }

@Injectable({ providedIn: 'root' })
export class MetaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private ciudades$ = new ReplaySubject<Ciudad[]>(1);
  private categorias$ = new ReplaySubject<Categoria[]>(1);
  private ciudadesLoaded = false;
  private categoriasLoaded = false;

  getCiudades(): Observable<Ciudad[]> {
    if (!this.ciudadesLoaded) {
      this.ciudadesLoaded = true;
      this.http.get<Ciudad[]>(`${this.apiUrl}/ciudades`)
        .pipe(catchError(() => of([] as Ciudad[])))
        .subscribe(d => this.ciudades$.next(d));
    }
    return this.ciudades$.asObservable();
  }

  getCategorias(): Observable<Categoria[]> {
    if (!this.categoriasLoaded) {
      this.categoriasLoaded = true;
      this.http.get<Categoria[]>(`${this.apiUrl}/categorias`)
        .pipe(catchError(() => of([] as Categoria[])))
        .subscribe(d => this.categorias$.next(d));
    }
    return this.categorias$.asObservable();
  }
}
