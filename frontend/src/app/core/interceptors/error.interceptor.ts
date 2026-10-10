import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Only trigger session logout if this is NOT a login/register attempt
        if (!req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
          console.warn('Session expired or unauthorized request to:', req.url);
          authService.logout();
        }
      } else if (error.status === 403) {
        console.warn('Forbidden resource:', req.url);
      }
      return throwError(() => error);
    })
  );
};
