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
    <div class="min-h-screen flex bg-brand-bg text-text-main font-sans relative overflow-hidden">
      <!-- Left Screen: Brand Hero & Visual Showcase (Hidden on Mobile) -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FFF5F7] via-[#FCE4EC] to-[#F8DDE4] flex-col justify-between p-12 lg:p-14 relative overflow-hidden select-none border-r border-brand-border/40">
        <!-- Background Architectural Patterns & Glowing Ambient Elements -->
        <div class="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>
        <div class="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none"></div>

        <!-- Animated Glowing Orbs & Meshes -->
        <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E98FA3]/35 to-[#FFF0F5]/50 blur-3xl animate-pulse-soft pointer-events-none"></div>
        <div class="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#D96F88]/25 to-[#C3B1E1]/30 blur-2xl animate-float-slow pointer-events-none"></div>
        <div class="absolute -bottom-20 right-10 w-72 h-72 rounded-full bg-gradient-to-t from-[#8FB9A8]/25 to-[#E98FA3]/30 blur-2xl animate-float-reverse pointer-events-none"></div>

        <!-- Top Header & Live Security Pill -->
        <div class="flex items-center justify-between z-10">
          <div class="flex items-center gap-4 group cursor-default">
            <img src="/logo-icon.png" alt="BACHAT Logo" class="h-16 w-16 object-contain rounded-2xl drop-shadow-md transition-transform group-hover:scale-105 duration-300 flex-shrink-0" />
            <div class="flex flex-col justify-center">
              <div class="flex items-center gap-2">
                <span class="text-3xl xl:text-4xl font-black text-text-main tracking-tight leading-none">BACHAT</span>
                <span class="text-xs font-black uppercase tracking-wider text-brand-primary-dark bg-brand-primary/15 border border-brand-primary/25 px-2 py-0.5 rounded-md">PLATFORM</span>
              </div>
              <span class="text-xs sm:text-sm font-extrabold text-[#524B53] tracking-wider uppercase mt-1.5 leading-snug">
                Personal Finance &amp; Budget Management Platform
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm text-xs font-semibold text-text-sub">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

        <!-- Main Hero Statement & Floating FinTech Visuals -->
        <div class="my-auto max-w-lg z-10 py-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary-dark font-bold text-xs uppercase tracking-wider mb-4">
            <span>✨</span>
            <span>Smart Personal Finance Platform</span>
          </div>

          <h1 class="text-4xl xl:text-5xl font-black text-brand-primary-dark leading-[1.15] tracking-tight">
            Simplify your budget. <br>
            <span class="bg-gradient-to-r from-brand-primary-dark via-[#B84D67] to-brand-primary bg-clip-text text-transparent">
              Grow your savings.
            </span>
          </h1>

          <p class="text-text-sub mt-4 text-base leading-relaxed max-w-md">
            BACHAT delivers real-time expense telemetry, proactive budget guardrails, and automated goal milestones engineered for your financial freedom.
          </p>

          <!-- Interactive FinTech Floating Showcase Cards -->
          <div class="mt-8 space-y-3.5 max-w-sm">
            <!-- Glass Card 1: Monthly Surplus -->
            <div class="glass-card-hero rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">📈</span>
                  <span class="text-xs font-bold text-text-main">Monthly Surplus</span>
                </div>
                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">+24.8% vs target</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-2xl font-black text-text-main tracking-tight">₹ 84,250</span>
                <span class="text-xs text-text-sub font-medium">Safe to invest</span>
              </div>
              <!-- Mini Progress bar -->
              <div class="mt-2.5 w-full bg-white/60 h-2 rounded-full overflow-hidden p-0.5">
                <div class="bg-gradient-to-r from-brand-primary to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 76%"></div>
              </div>
            </div>

            <!-- Glass Card 2: Goal Achievement Pill -->
            <div class="glass-card-hero rounded-2xl p-3.5 flex items-center justify-between transition-all duration-300 hover:translate-y-[-2px]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm shadow-sm">🎯</div>
                <div>
                  <p class="text-xs font-bold text-text-main">Emergency Fund Goal</p>
                  <p class="text-[11px] text-text-sub">₹2,50,000 / ₹2,50,000 completed</p>
                </div>
              </div>
              <span class="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <span>100%</span>
                <span>🏆</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Left Footer: Trust Badges -->
        <div class="z-10 pt-4 border-t border-brand-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-sub">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1 text-[11px] font-semibold text-text-sub/80">
              <span>🛡️</span> Zero-Knowledge Auth
            </span>
            <span class="flex items-center gap-1 text-[11px] font-semibold text-text-sub/80">
              <span>⚡</span> Real-time Sync
            </span>
          </div>
          <div class="text-[11px] text-text-sub/70">
            &copy; 2026 BACHAT Finance.
          </div>
        </div>
      </div>

      <!-- Right Screen: Form Container with Ambient Background Elements -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#FFFDFD] via-[#FFF9F7] to-[#FFF0F3] relative overflow-hidden">
        <!-- Ambient Background Lights & Grid for Right Side -->
        <div class="absolute inset-0 bg-grid-subtle opacity-60 pointer-events-none"></div>
        <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-200/25 blur-3xl pointer-events-none"></div>

        <!-- Floating subtle geometric accents -->
        <div class="absolute top-12 right-12 w-16 h-16 border-2 border-brand-primary/20 rounded-2xl rotate-12 pointer-events-none animate-float-slow"></div>
        <div class="absolute bottom-16 left-12 w-10 h-10 border border-brand-primary/25 rounded-full pointer-events-none animate-float-reverse"></div>

        <!-- Main Form Glass Card -->
        <div class="glass-card-elevated max-w-md w-full p-8 sm:p-10 rounded-3xl relative z-10 transition-all duration-300">
          <!-- Mobile Brand Logo -->
          <div class="lg:hidden flex items-center justify-center gap-3.5 mb-6">
            <img src="/logo-icon.png" alt="BACHAT Logo" class="h-12 w-12 object-contain rounded-xl drop-shadow-sm flex-shrink-0" />
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="text-2xl font-black text-text-main tracking-tight leading-none">BACHAT</span>
                <span class="text-[10px] font-black uppercase tracking-wider text-brand-primary-dark bg-brand-primary/15 border border-brand-primary/25 px-1.5 py-0.5 rounded-md">APP</span>
              </div>
              <span class="text-xs font-extrabold text-[#524B53] tracking-wider uppercase mt-1 leading-tight">
                Personal Finance &amp; Budget Management Platform
              </span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center gap-2">
              <h2 class="text-3xl font-black text-text-main tracking-tight">Welcome back</h2>
              <span class="text-2xl animate-wave">👋</span>
            </div>
            <p class="mt-2 text-sm text-text-sub">
              Sign in to manage your budget, or 
              <a routerLink="/register" class="font-bold text-brand-primary hover:text-brand-primary-dark underline decoration-brand-primary/40 underline-offset-4 transition-colors">create an account</a>.
            </p>
          </div>

          <!-- Already Logged In Banner -->
          <div *ngIf="authService.isAuthenticated()" class="mb-5 bg-blue-50/90 border border-blue-200 text-blue-800 p-4 rounded-2xl text-sm flex items-center justify-between gap-3 shadow-sm backdrop-blur-sm">
            <div class="flex items-center gap-2">
              <span class="text-lg">👋</span>
              <div>
                <p class="font-bold text-xs uppercase tracking-wide text-blue-600">Active Session Found</p>
                <p class="text-xs text-blue-900">Signed in as <strong>{{ authService.currentUser()?.email }}</strong></p>
              </div>
            </div>
            <a routerLink="/dashboard" class="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 hover:shadow">
              <span>Go to App</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Success Alert -->
          <div *ngIf="successMessage()" class="mb-5 bg-emerald-50/90 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-sm backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ successMessage() }}</span>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage()" class="mb-5 bg-red-50/90 border border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-sm backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium">{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="email" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>✉️</span>
                <span>Email Address</span>
              </label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3.5 rounded-2xl border border-brand-border bg-white/90 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/15 focus:border-brand-primary transition-all duration-200 shadow-sm"
                [class.border-red-400]="isFieldInvalid('email')"
              >
              <p *ngIf="isFieldInvalid('email')" class="text-xs text-red-500 font-medium mt-1.5 ml-1">Please enter a valid email address</p>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label for="password" class="block text-xs font-bold text-text-sub uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Password</span>
                </label>
                <a class="text-xs text-brand-primary font-bold hover:underline cursor-pointer" (click)="forgotPasswordPlaceholder()">Forgot password?</a>
              </div>
              <div class="relative">
                <input 
                  id="password" 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3.5 pr-11 rounded-2xl border border-brand-border bg-white/90 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/15 focus:border-brand-primary transition-all duration-200 shadow-sm"
                  [class.border-red-400]="isFieldInvalid('password')"
                >
                <button 
                  type="button" 
                  (click)="togglePasswordVisibility()" 
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary focus:outline-none text-base p-1 transition-colors"
                  tabindex="-1"
                  aria-label="Toggle password visibility"
                >
                  {{ showPassword() ? '👁️' : '🙈' }}
                </button>
              </div>
              <p *ngIf="isFieldInvalid('password')" class="text-xs text-red-500 font-medium mt-1.5 ml-1">Password is required</p>
            </div>

            <button 
              type="submit" 
              [disabled]="loading()"
              class="w-full py-3.5 px-4 bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-[#C65A73] active:scale-[0.99] text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg *ngIf="loading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading() ? 'Signing In...' : 'Sign In' }}</span>
              <span *ngIf="!loading()">→</span>
            </button>
          </form>

          <!-- Security note -->
          <div class="mt-6 pt-5 border-t border-brand-border/60 flex items-center justify-center gap-2 text-xs text-text-sub font-medium">
            <span>🛡️</span>
            <span>Protected by JWT & Argon2 Security</span>
          </div>
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
