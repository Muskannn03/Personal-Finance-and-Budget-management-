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
    <div class="min-h-screen bg-[#FDECE9] bg-gradient-to-br from-[#FFF5F3] via-[#FDECE9] to-[#FADFD9] text-text-main font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none">
      <!-- Ambient Background Elements & Blobs -->
      <div class="absolute inset-0 bg-dot-pattern-light opacity-60 pointer-events-none"></div>
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#E98FA3]/25 to-[#FDE2E4]/40 blur-3xl animate-pulse-soft pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-[#F27A59]/20 to-[#E98FA3]/25 blur-3xl animate-float-slow pointer-events-none"></div>

      <!-- Top Header: High-Visibility Brand & Subtitle -->
      <header class="w-full max-w-4xl flex items-center justify-between mb-6 z-10 px-2 sm:px-4">
        <div class="flex items-center gap-3.5 group cursor-default">
          <img src="/logo-icon.png" alt="BACHAT Logo" class="h-12 w-12 object-contain rounded-2xl drop-shadow-sm transition-transform group-hover:scale-105 duration-300 flex-shrink-0" />
          <div class="flex flex-col justify-center">
            <div class="flex items-center gap-2">
              <span class="text-2xl sm:text-3xl font-black text-[#29252A] tracking-tight leading-none">BACHAT</span>
              <span class="text-[10px] font-black uppercase tracking-wider text-brand-primary-dark bg-white/80 border border-brand-primary/25 px-2 py-0.5 rounded-full shadow-xs">FINANCE</span>
            </div>
            <span class="text-xs sm:text-sm font-extrabold text-[#524B53] tracking-wider uppercase mt-1 leading-snug">
              Personal Finance &amp; Budget Management Platform
            </span>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-xs text-xs font-semibold text-text-sub">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>256-Bit SSL Secured</span>
        </div>
      </header>

      <!-- Main Floating Card (Dribbble Style) -->
      <div class="max-w-4xl w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_70px_rgba(217,111,136,0.22)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/90 transition-all duration-300">
        
        <!-- Left Side: Animated Plant in Terracotta Pot & Fluid Organic Blob -->
        <div class="w-full md:w-1/2 bg-[#FFF9F8] p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-[#F7EBEB]">
          <!-- Inner Ambient Blobs -->
          <div class="absolute -top-10 -left-10 w-48 h-48 bg-[#FDEBE8] rounded-full blur-2xl pointer-events-none"></div>
          <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FCE5E8] rounded-full blur-2xl pointer-events-none"></div>

          <!-- Handcrafted Animated Vector Plant Illustration -->
          <div class="w-full max-w-[320px] h-[340px] sm:h-[380px] flex items-center justify-center relative z-10">
            <svg viewBox="0 0 400 460" class="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Soft Organic Background Fluid Blob -->
              <path d="M130 60C230 20 340 80 360 180C380 280 320 390 220 410C120 430 45 360 35 260C25 160 30 100 130 60Z" 
                    fill="#FDE7E5" class="animate-pulse-soft" />

              <!-- Cast Shadow under Flower Pot -->
              <ellipse cx="200" cy="412" rx="55" ry="14" fill="#ECD5D8" />

              <!-- Animated Plant Stems & Foliage (Swaying with Breeze) -->
              <g class="animate-plant-sway" style="transform-origin: 200px 370px;">
                <!-- Back Leaves Layer (Pale Blush Rose) -->
                <path d="M190 270C135 250 95 190 105 130C118 160 142 165 130 195C148 198 162 230 190 270Z" 
                      fill="#FBCFD6" />
                <path d="M195 230C168 170 155 100 200 60C210 90 230 102 218 138C235 148 230 185 205 230Z" 
                      fill="#F7BBC3" />
                <path d="M205 260C238 230 290 190 295 125C278 152 252 158 262 188C248 198 236 228 205 260Z" 
                      fill="#F8C2C9" />

                <!-- Front Foliage Silhouettes Layer -->
                <path d="M195 315C150 305 115 270 120 215C132 228 142 222 142 210C152 232 165 232 175 228C165 255 180 270 195 315Z" 
                      fill="#F9B8C2" />
                <path d="M205 315C245 305 280 270 275 215C262 228 252 222 252 210C242 232 228 232 218 228C228 255 215 270 205 315Z" 
                      fill="#F6A8B5" />

                <!-- Dark Indigo Delicate Branches -->
                <path d="M200 370L200 170" stroke="#2B2738" stroke-width="4.5" stroke-linecap="round" />
                <path d="M200 305C170 285 140 250 130 200" stroke="#2B2738" stroke-width="4" stroke-linecap="round" />
                <path d="M200 265C230 245 260 215 270 160" stroke="#2B2738" stroke-width="4" stroke-linecap="round" />
                <path d="M200 220C182 200 172 170 178 130" stroke="#2B2738" stroke-width="3.5" stroke-linecap="round" />
                <path d="M200 200C218 185 228 160 222 120" stroke="#2B2738" stroke-width="3.5" stroke-linecap="round" />
                
                <!-- Side Twigs -->
                <path d="M152 240L168 235" stroke="#2B2738" stroke-width="3" stroke-linecap="round" />
                <path d="M248 225L232 218" stroke="#2B2738" stroke-width="3" stroke-linecap="round" />
                <path d="M185 188L175 178" stroke="#2B2738" stroke-width="3" stroke-linecap="round" />
                <path d="M215 172L225 165" stroke="#2B2738" stroke-width="3" stroke-linecap="round" />
              </g>

              <!-- Terracotta Coral Geometric Flower Pot -->
              <!-- Pot Soil Base -->
              <ellipse cx="200" cy="358" rx="38" ry="9" fill="#4A2626" />
              <!-- Pot Top Rim -->
              <path d="M158 352C158 347 242 347 242 352L240 366C240 371 160 371 160 366Z" fill="#F27A59" />
              <path d="M160 352C170 355 230 355 240 352" stroke="#E56745" stroke-width="2" />
              <!-- Pot Body (Tapered) -->
              <path d="M162 366L173 408C174 412 226 412 227 408L238 366Z" fill="#F27A59" />
              <!-- Pot Highlight Stripe (Left Light Accent) -->
              <path d="M165 366L175 408C178 410 186 410 186 408L178 366Z" fill="#FA9274" opacity="0.85" />
              <!-- Pot Shadow Stripe (Right Dark Accent) -->
              <path d="M224 366L218 408C222 410 226 410 227 408L238 366Z" fill="#DD5D3A" opacity="0.85" />
            </svg>
          </div>

          <!-- Bottom caption on illustration -->
          <div class="mt-2 text-center z-10">
            <p class="text-xs font-bold text-[#A57882] tracking-wider uppercase">Grow your savings with BACHAT</p>
          </div>
        </div>

        <!-- Right Side: Clean Dribbble-Style Form -->
        <div class="w-full md:w-1/2 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative">
          
          <div class="mb-8">
            <h1 class="text-4xl sm:text-5xl font-light text-[#292338] tracking-tight">Login</h1>
            <p class="mt-2 text-xs text-[#8A828F] font-medium">
              Sign in to manage your budget, or 
              <a routerLink="/register" class="font-bold text-[#F27A59] hover:text-[#D96F88] underline decoration-[#F27A59]/40 underline-offset-4 transition-colors">create an account</a>.
            </p>
          </div>

          <!-- Already Logged In Banner -->
          <div *ngIf="authService.isAuthenticated()" class="mb-6 bg-[#FFF4F2] border border-[#FCD9D4] text-[#B84D35] p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-2">
              <span>👋</span>
              <div>
                <p class="font-bold uppercase tracking-wider text-[10px] text-[#F27A59]">Active Session</p>
                <p class="text-xs text-[#7A3626] truncate max-w-[150px] sm:max-w-[190px]">Signed in as <strong>{{ authService.currentUser()?.email }}</strong></p>
              </div>
            </div>
            <a routerLink="/dashboard" class="px-3 py-1.5 bg-[#F27A59] hover:bg-[#E46B4A] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 flex-shrink-0">
              <span>Go to App</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Success Alert -->
          <div *ngIf="successMessage()" class="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-semibold">{{ successMessage() }}</span>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage()" class="mb-5 bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-semibold">{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Address Field with Dribbble Underline Style -->
            <div class="relative group">
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="yourmail@dribbble.com"
                class="w-full pb-2 pt-2 border-b-2 border-[#EAE3E6] group-focus-within:border-[#F27A59] text-sm sm:text-base font-light text-[#29252A] placeholder-[#B5ACB6] bg-transparent focus:outline-none transition-colors duration-300"
                [class.border-red-400]="isFieldInvalid('email')"
              >
              <!-- Verification indicator matching Dribbble circle checkmark -->
              <div class="absolute right-1 top-2.5 text-[#F27A59]" *ngIf="loginForm.get('email')?.valid && !isFieldInvalid('email')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p *ngIf="isFieldInvalid('email')" class="text-xs text-red-500 font-medium mt-1">Please enter a valid email address</p>
            </div>

            <!-- Password Field with Underline Style & Eye Toggle -->
            <div class="relative group">
              <input 
                id="password" 
                [type]="showPassword() ? 'text' : 'password'" 
                formControlName="password"
                placeholder="••••••••"
                class="w-full pb-2 pt-2 pr-8 border-b-2 border-[#EAE3E6] group-focus-within:border-[#F27A59] text-sm sm:text-base font-light text-[#29252A] placeholder-[#B5ACB6] bg-transparent focus:outline-none transition-colors duration-300 tracking-wider"
                [class.border-red-400]="isFieldInvalid('password')"
              >
              <button 
                type="button" 
                (click)="togglePasswordVisibility()" 
                class="absolute right-1 top-2.5 text-[#A69EA8] hover:text-[#F27A59] focus:outline-none text-sm transition-colors"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                {{ showPassword() ? '👁️' : '🙈' }}
              </button>
              <p *ngIf="isFieldInvalid('password')" class="text-xs text-red-500 font-medium mt-1">Password is required</p>
            </div>

            <!-- Centered Coral Pill Button matching screenshot -->
            <div class="flex justify-center pt-3">
              <button 
                type="submit" 
                [disabled]="loading()"
                class="px-10 py-3 rounded-full bg-gradient-to-r from-[#F27A59] to-[#E98FA3] hover:from-[#E46B4A] hover:to-[#D96F88] active:scale-95 text-white text-sm font-semibold shadow-md shadow-[#F27A59]/30 hover:shadow-lg transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg *ngIf="loading()" class="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ loading() ? 'Signing In...' : 'Sign in' }}</span>
              </button>
            </div>

            <!-- Forgot password link -->
            <div class="text-center pt-1">
              <a (click)="forgotPasswordPlaceholder()" class="text-xs text-[#9B939E] hover:text-[#F27A59] cursor-pointer transition-colors font-medium">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Bottom Floating Ambient Badges (matching Visit site and action widgets) -->
      <footer class="w-full max-w-4xl flex items-center justify-between mt-6 z-10 px-2 sm:px-4 text-xs text-[#8F8792]">
        <div class="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-xs">
          <span>↗</span>
          <span class="font-bold text-[#29252A]">Visit site</span>
          <span class="text-[#B5ACB6]">•</span>
          <span>BACHAT Finance</span>
        </div>

        <div class="flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-xs font-semibold">
          <span>🛡️</span>
          <span>Protected by JWT &amp; Argon2</span>
        </div>
      </footer>
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
