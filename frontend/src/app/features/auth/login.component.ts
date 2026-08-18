import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6; lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-slate-900">PFBM Sign In</h2>
          <p class="mt-2 text-center text-sm text-slate-600">
            Or
            <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500">register a new account</a>
          </p>
        </div>
        <div class="mt-8 space-y-6">
          <button (click)="mockLogin()" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Proceed with Mock Login (Muskan Kapri)
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  router = inject(Router);

  mockLogin() {
    // Save a mock session for Muskan Kapri
    localStorage.setItem('access_token', 'mock_jwt_token');
    localStorage.setItem('user_session', JSON.stringify({
      userId: 'e3952bb0-b74a-4d7a-8f5b-1662fb1655b3',
      name: 'Muskan Kapri',
      email: 'kaprimuskan6@gmail.com',
      role: 'ADMIN'
    }));
    // Force reload session in window or navigate
    window.location.href = '/dashboard';
  }
}
