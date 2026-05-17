import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

// Endpoints públicos donde NO se adjunta el Bearer token
const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const isPublic = PUBLIC_PATHS.some(p => req.url.includes(p));
  const token = isPublic ? null : storage.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // Debug (útil para verificar que el interceptor corre): se puede quitar después
  if (!isPublic && !token) {
    // eslint-disable-next-line no-console
    console.warn('[authInterceptor] sin token en localStorage para', req.url);
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token expirado o inválido → cerrar sesión y redirigir
      if (err.status === 401 && !isPublic) {
        storage.clearAll();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
