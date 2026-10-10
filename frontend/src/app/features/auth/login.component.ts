import { Component, inject } from '@angular/core';
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

          <!-- Success Alert -->
          <div *ngIf="successMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage }}</span>
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
              <input 
                id="password" 
                type="password" 
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                [class.border-red-400]="isFieldInvalid('password')"
              >
              <p *ngIf="isFieldInvalid('password')" class="text-xs text-red-500 mt-1">Password is required</p>
            </div>

            <button 
              type="submit" 
              [disabled]="loading"
              class="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <!-- One-click Demo / Seed Account Login -->
          <div class="pt-6 border-t border-brand-border text-center space-y-2">
            <p class="text-xs text-text-sub">Quick login with pre-loaded database seed account:</p>
            <button 
              type="button"
              (click)="proceedWithSeedAccount()" 
              [disabled]="loading"
              class="w-full py-2.5 px-4 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white text-xs font-bold rounded-2xl transition-all duration-200 focus:outline-none border border-brand-primary flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>1-Click Sign In as Muskan (kaprimuskan6@gmail.com)</span>
            </button>
            <p class="text-[11px] text-text-sub">
              Or <a (click)="fillSeedCredentials()" class="text-brand-primary font-semibold hover:underline cursor-pointer">fill demo credentials</a> into the form above.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    // Check if user just registered or wants pre-filled email from route state or URL
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['registered']) {
      this.successMessage = 'Account created successfully! Please sign in below.';
    }
    if (nav?.extras?.state?.['email']) {
      this.loginForm.patchValue({ email: nav.extras.state['email'] });
    }
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

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formVal = this.loginForm.value;
    const loginPayload = {
      email: (formVal.email || '').trim().toLowerCase(),
      password: formVal.password
    };

    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        this.errorMessage = err?.error?.message || 'Invalid email address or password. Please try again.';
      }
    });
  }

  proceedWithSeedAccount() {
    this.fillSeedCredentials();
    this.onSubmit();
  }

  fillSeedCredentials() {
    this.loginForm.patchValue({
      email: 'kaprimuskan6@gmail.com',
      password: 'Password@123'
    });
    this.errorMessage = '';
  }

  forgotPasswordPlaceholder() {
    this.errorMessage = '';
    this.fillSeedCredentials();
    this.successMessage = "Demo credentials loaded (kaprimuskan6@gmail.com / Password@123). Click Sign In.";
  }
}
