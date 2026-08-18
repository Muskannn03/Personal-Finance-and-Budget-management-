import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private sessionSignal = signal<UserSession | null>(null);

  currentUser = computed(() => this.sessionSignal());
  isAuthenticated = computed(() => this.sessionSignal() !== null);

  constructor() {
    this.loadSessionFromStorage();
  }

  register(userData: any): Observable<any> {
    return this.api.post<any>('/auth/register', userData);
  }

  login(credentials: any): Observable<any> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      tap((res: any) => {
        if (res && res.data) {
          const data: JwtResponse = res.data;
          this.saveSession(data.accessToken, {
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role
          });
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_session');
    this.sessionSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }

  private saveSession(token: string, session: UserSession) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_session', JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private loadSessionFromStorage() {
    const token = localStorage.getItem('access_token');
    const sessionStr = localStorage.getItem('user_session');

    if (token && sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        this.sessionSignal.set(session);
      } catch (e) {
        this.logout();
      }
    }
  }
}
