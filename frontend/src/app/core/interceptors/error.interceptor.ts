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
        alert('Session expired. Please log in again.');
        authService.logout();
      } else if (error.status === 403) {
        alert("You don't have permission to perform this action.");
      }
      return throwError(() => error);
    })
  );
};
