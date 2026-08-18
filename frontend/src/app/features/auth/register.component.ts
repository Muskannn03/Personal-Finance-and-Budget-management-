import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-slate-900">Create an Account</h2>
          <p class="mt-2 text-center text-sm text-slate-600">
            Already have an account?
            <a routerLink="/login" class="font-medium text-blue-600 hover:text-blue-500">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {}
