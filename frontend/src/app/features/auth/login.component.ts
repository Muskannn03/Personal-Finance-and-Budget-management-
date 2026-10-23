import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex bg-brand-bg text-text-main font-sans">
      <!-- Left Screen: Brand Info (Hidden on Mobile) -->
      <div class="hidden lg:flex lg:w-1/2 bg-brand-primary-light flex-col justify-between p-12 relative overflow-hidden">
        <!-- Abstract pastel graphics -->
        <div class="absolute -top-16 -left-16 w-64 h-64 bg-white rounded-full opacity-30 filter blur-2xl"></div>
        <div class="absolute -bottom-24 -right-12 w-80 h-80 bg-brand-primary rounded-full opacity-20 filter blur-3xl"></div>
        
        <div class="flex items-center gap-3 z-10">
          <img src="/logo.png" alt="BACHAT Logo" class="h-14 w-auto object-contain drop-shadow-sm" />
        </div>

        <div class="my-auto max-w-lg z-10">
          <h1 class="text-4xl font-extrabold text-brand-primary-dark leading-tight">
            Simplify your budget. <br>Grow your savings.
          </h1>
          <p class="text-text-sub mt-4 text-base leading-relaxed">
            BACHAT is a premium personal finance manager designed to help you track expenses, enforce budgets, save for life goals, and optimize your investments with simple, visual ease.
          </p>
        </div>

        <div class="text-xs text-text-sub z-10">
          &copy; 2026 BACHAT Finance. Crafted for smart budget management.
        </div>
      </div>

      <!-- Right Screen: Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div class="max-w-md w-full space-y-8">
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex justify-center mb-4">
            <img src="/logo.png" alt="BACHAT Logo" class="h-11 w-auto object-contain" />
          </div>
          <div>
            <h2 class="text-3xl font-extrabold text-text-main tracking-tight">Welcome back</h2>
            <p class="mt-2 text-sm text-text-sub">
              Sign in to manage your budget, or 
              <a routerLink="/register" class="font-semibold text-brand-primary hover:text-brand-primary-dark underline">create an account</a>.
            </p>
          </div>

          <!-- Already Logged In Banner -->
          <div *ngIf="authService.isAuthenticated()" class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl text-sm flex items-center justify-between gap-3 shadow-sm">
            <div class="flex items-center gap-2">
              <span class="text-lg">👋</span>
              <div>
                <p class="font-bold text-xs uppercase tracking-wide text-blue-600">Active Session Found</p>
                <p class="text-xs text-blue-900">Signed in as <strong>{{ authService.currentUser()?.email }}</strong></p>
              </div>
            </div>
            <a routerLink="/dashboard" class="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1">
              <span>Go to App</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Success Alert -->
          <div *ngIf="successMessage()" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage() }}</span>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage()" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
            <div>
              <label for="email" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                [class.border-red-400]="isFieldInvalid('email')"
              >
              <p *ngIf="isFieldInvalid('email')" class="text-xs text-red-500 mt-1">Please enter a valid email address</p>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label for="password" class="block text-xs font-bold text-text-sub uppercase tracking-wider">Password</label>
                <a class="text-xs text-brand-primary font-semibold hover:underline cursor-pointer" (click)="forgotPasswordPlaceholder()">Forgot password?</a>
              </div>
              <div class="relative">
                <input 
                  id="password" 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 pr-11 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                  [class.border-red-400]="isFieldInvalid('password')"
                >
                <button 
                  type="button" 
                  (click)="togglePasswordVisibility()" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none text-sm p-1"
                  tabindex="-1"
                >
                  {{ showPassword() ? '👁️' : '🙈' }}
                </button>
              </div>
              <p *ngIf="isFieldInvalid('password')" class="text-xs text-red-500 mt-1">Password is required</p>
            </div>

            <button 
              type="submit" 
              [disabled]="loading()"
              class="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading() ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  constructor() {
    // Check if user just registered or wants pre-filled email from route state or URL
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['registered']) {
      this.successMessage.set('Account created successfully! Please sign in below.');
    }
    if (nav?.extras?.state?.['email']) {
      this.loginForm.patchValue({ email: nav.extras.state['email'] });
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
    this.cdr.markForCheck();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cdr.markForCheck();

    const formVal = this.loginForm.value;
    const loginPayload = {
      email: (formVal.email || '').trim().toLowerCase(),
      password: formVal.password
    };

    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login error:', err);
        const msg = err?.error?.message || 'Invalid email address or password. Please try again.';
        this.errorMessage.set(msg);
        this.cdr.markForCheck();
      }
    });
  }

  forgotPasswordPlaceholder() {
    this.errorMessage.set('');
    this.successMessage.set("Please contact your system administrator or verify your registered email address.");
    this.cdr.markForCheck();
  }
}
