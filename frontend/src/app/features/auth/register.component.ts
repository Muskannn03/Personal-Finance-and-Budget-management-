import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
          <div class="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-bold text-xl shadow-md border border-brand-primary-dark">
            B
          </div>
          <span class="font-extrabold text-2xl tracking-tight text-brand-primary-dark">BACHAT</span>
        </div>

        <div class="my-auto max-w-lg z-10">
          <h1 class="text-4xl font-extrabold text-brand-primary-dark leading-tight">
            Create an account. <br>Start your journey today.
          </h1>
          <p class="text-text-sub mt-4 text-base leading-relaxed">
            Gain full control of your finances. Organize your monthly budgets, set milestones for personal goals, and manage your asset allocations in real time.
          </p>
        </div>

        <div class="text-xs text-text-sub z-10">
          &copy; 2026 BACHAT Finance. Crafted for smart budget management.
        </div>
      </div>

      <!-- Right Screen: Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="text-3xl font-extrabold text-text-main tracking-tight">Create Account</h2>
            <p class="mt-2 text-sm text-text-sub">
              Already have an account? 
              <a routerLink="/login" class="font-semibold text-brand-primary hover:text-brand-primary-dark underline">Sign in</a>.
            </p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Success Alert -->
          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
            {{ successMessage }}
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
            <div>
              <label for="name" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Full Name</label>
              <input 
                id="name" 
                type="text" 
                formControlName="name"
                placeholder="Your name"
                class="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                [class.border-red-400]="isFieldInvalid('name')"
              >
              <p *ngIf="isFieldInvalid('name')" class="text-xs text-red-500 mt-1">Full Name must be at least 2 characters</p>
            </div>

            <div>
              <label for="email" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="name@example.com"
                class="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                [class.border-red-400]="isFieldInvalid('email')"
              >
              <p *ngIf="isFieldInvalid('email')" class="text-xs text-red-500 mt-1">Please enter a valid email address</p>
            </div>

            <div>
              <label for="password" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Password</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-bg text-sm focus:outline-none focus:border-brand-primary transition-all duration-200"
                [class.border-red-400]="isFieldInvalid('password')"
              >
              <p *ngIf="isFieldInvalid('password')" class="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
            </div>

            <button 
              type="submit" 
              [disabled]="loading"
              class="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating Account...' : 'Register' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  errorMessage = '';
  successMessage = '';

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerPayload = {
      ...this.registerForm.value,
      currencyPreference: 'INR'
    };

    this.authService.register(registerPayload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err?.error?.message || 'Registration failed. The email address might already be registered.';
      }
    });
  }
}
