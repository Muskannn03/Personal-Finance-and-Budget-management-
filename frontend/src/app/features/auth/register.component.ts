import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen lg:h-screen lg:max-h-screen bg-[#FFF9F5] text-[#28232A] font-sans relative overflow-x-hidden overflow-y-auto lg:overflow-hidden flex flex-col justify-between selection:bg-[#FF8A78]/20 selection:text-[#28232A]">
      
      <!-- Ambient Studio Background: Diagonal Window Light Shadows -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <!-- Soft natural diagonal window slats cast on the wall -->
        <div class="absolute -top-24 -left-20 w-[700px] h-[900px] window-light-pattern opacity-40 transform rotate-6 pointer-events-none"></div>

        <!-- Lower-Left Subtle Organic Blush Wave & Coral Line -->
        <svg class="absolute bottom-0 left-0 w-[380px] sm:w-[480px] lg:w-[620px] h-auto pointer-events-none select-none text-[#FCEAE6]" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-80 350 L-80 180 C40 160 120 220 200 240 C320 270 420 220 500 350 Z" fill="currentColor" fill-opacity="0.8" />
          <path d="M-80 230 C50 180 140 240 240 260 C360 280 440 230 500 350" stroke="#FF8A78" stroke-width="1.5" stroke-opacity="0.35" fill="none" />
        </svg>

        <!-- Lower-Right Subtle Organic Blush Wave & Coral Line -->
        <svg class="absolute bottom-0 right-0 w-[340px] sm:w-[440px] lg:w-[560px] h-auto pointer-events-none select-none text-[#FCEAE6]" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M580 350 L580 210 C460 190 380 250 280 250 C180 250 80 300 0 350 Z" fill="currentColor" fill-opacity="0.75" />
          <path d="M580 260 C440 210 360 270 260 270 C160 270 60 320 0 350" stroke="#FF8A78" stroke-width="1.5" stroke-opacity="0.3" fill="none" />
        </svg>

        <!-- Lower-Right Botanical Leaf Branch (Matching reference image) -->
        <svg class="absolute bottom-0 right-0 w-36 sm:w-48 lg:w-60 h-auto pointer-events-none select-none text-[#F16F83]" viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.65" transform="rotate(-15 160 240)">
            <!-- Branch stem -->
            <path d="M220 280 C180 220 140 140 150 40" stroke="#4A3B44" stroke-width="2.5" stroke-linecap="round" opacity="0.35" />
            <!-- Leaves -->
            <path d="M150 40 C140 15 120 10 110 30 C100 50 130 65 150 40 Z" fill="#FFAAA0" />
            <path d="M150 40 C160 20 180 15 190 35 C195 55 165 65 150 40 Z" fill="#F1828D" />
            
            <path d="M145 90 C120 70 95 75 90 95 C85 115 125 120 145 90 Z" fill="#FFAAA0" />
            <path d="M148 110 C175 90 200 95 205 115 C210 135 170 140 148 110 Z" fill="#F1828D" />

            <path d="M142 160 C110 140 85 150 80 170 C75 195 120 195 142 160 Z" fill="#FFAAA0" />
            <path d="M146 180 C180 160 205 170 210 190 C215 215 170 215 146 180 Z" fill="#F1828D" />
          </g>
        </svg>

        <!-- Subtle Studio Horizon Line / Floor Edge -->
        <div class="absolute bottom-[80px] sm:bottom-[100px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8DFD9]/60 to-transparent pointer-events-none"></div>
      </div>

      <!-- Top Header Navigation -->
      <header class="w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-8 sm:pt-10 flex items-start justify-between z-10 relative">
        <!-- Left: BACHAT Brand Identity -->
        <div class="flex items-center gap-3.5 group cursor-default">
          <!-- Coral Badge with White Sprout on Coins Icon -->
          <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF8A78] to-[#F16F83] flex items-center justify-center shadow-sm shadow-[#FF8A78]/30 transition-transform group-hover:scale-105 duration-300 flex-shrink-0">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Sprout Leaves -->
              <path d="M12 4C10.5 4 8 5.5 8 8C8 10 10.5 11.5 12 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M12 4C13.5 4 16 5.5 16 8C16 10 13.5 11.5 12 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M12 4V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <!-- Stacked Coins Base -->
              <ellipse cx="12" cy="14" rx="5" ry="1.8" fill="currentColor" fill-opacity="0.9" />
              <path d="M7 14V17C7 18 9.2 19 12 19C14.8 19 17 18 17 17V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M7 17V20C7 21 9.2 22 12 22C14.8 22 17 21 17 20V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>

          <!-- Brand Typography -->
          <div class="flex flex-col">
            <span class="text-2xl sm:text-[26px] font-black tracking-tight text-[#28232A] leading-tight">BACHAT</span>
            <span class="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] text-[#88838C] uppercase -mt-0.5">PLAN &middot; TRACK &middot; GROW</span>
          </div>
        </div>

        <!-- Right: Poetic Tagline with Coral Underline -->
        <div class="hidden sm:flex flex-col items-end text-right">
          <p class="text-xs sm:text-[13px] text-[#88838C] font-normal leading-snug">
            A smarter<br>
            way to your<br>
            brighter tomorrow.
          </p>
          <div class="w-8 h-[2px] bg-[#FF8A78] rounded-full mt-2"></div>
        </div>
      </header>

      <!-- Main Two-Column Editorial Hero Layout -->
      <main class="w-full max-w-[1340px] mx-auto px-6 sm:px-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10 relative flex-1 min-h-0">
        
        <!-- LEFT COLUMN: Poetic Typography & Botanical Potted Plant -->
        <div class="lg:col-span-6 xl:col-span-7 flex flex-col justify-between items-start lg:h-full py-2 sm:py-4 pr-0 lg:pr-8 animate-fade-in-rise">
          
          <!-- Editorial Serif Headline -->
          <div class="mb-2 sm:mb-4">
            <h1 class="font-serif text-3xl sm:text-5xl xl:text-[62px] leading-[1.08] font-normal tracking-tight text-[#28232A]">
              Join the journey,<br>
              <span class="text-[#FF8A78]">bigger savings.</span>
            </h1>
            <p class="mt-2 sm:mt-3 text-[#88838C] text-xs sm:text-[15px] font-normal max-w-sm leading-relaxed">
              Start building healthy financial habits today with smart budgets and clear savings goals.
            </p>
          </div>

          <!-- Potted Botanical Plant with Soft Realistic Lighting -->
          <div class="hidden sm:flex w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[390px] h-[200px] sm:h-[250px] lg:h-[300px] relative items-end justify-start sm:ml-4 select-none">
            
            <svg viewBox="0 0 360 360" class="w-full h-full select-none overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="regWallShadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="12" />
                </filter>
                <filter id="regContactShadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
                <linearGradient id="regPotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#FFEFEB" />
                  <stop offset="35%" stop-color="#FCEAE6" />
                  <stop offset="75%" stop-color="#F8D3CB" />
                  <stop offset="100%" stop-color="#EAB9B0" />
                </linearGradient>
                <linearGradient id="regLeafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFAFA5" />
                  <stop offset="100%" stop-color="#EB8791" />
                </linearGradient>
                <linearGradient id="regLeafGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FCA69F" />
                  <stop offset="100%" stop-color="#DF737F" />
                </linearGradient>
              </defs>

              <!-- Soft Shadow on Wall Behind Plant -->
              <g filter="url(#regWallShadow)" opacity="0.18">
                <ellipse cx="140" cy="240" rx="45" ry="40" fill="#28232A" />
                <ellipse cx="130" cy="180" rx="35" ry="50" fill="#28232A" />
                <path d="M140 280 L120 320 L160 320 Z" fill="#28232A" />
              </g>

              <!-- Floor Ground Contact Shadow -->
              <ellipse cx="180" cy="336" rx="72" ry="14" fill="#DAC8C5" opacity="0.7" filter="url(#regContactShadow)" />
              <ellipse cx="180" cy="336" rx="52" ry="8" fill="#B39E9B" opacity="0.5" />

              <!-- Animated Plant Foliage & Stems -->
              <g class="animate-plant-sway" style="transform-origin: 180px 290px;">
                <path d="M180 290 C180 250 180 180 180 120" stroke="#332B34" stroke-width="3" stroke-linecap="round" />
                <path d="M180 250 C165 220 135 185 110 170" stroke="#332B34" stroke-width="2.6" stroke-linecap="round" />
                <path d="M180 220 C168 190 148 160 128 140" stroke="#332B34" stroke-width="2.4" stroke-linecap="round" />
                <path d="M180 245 C198 220 230 185 255 170" stroke="#332B34" stroke-width="2.6" stroke-linecap="round" />
                <path d="M180 215 C195 190 218 160 238 140" stroke="#332B34" stroke-width="2.4" stroke-linecap="round" />

                <!-- Leaves -->
                <g>
                  <path d="M180 130 C168 100 168 65 180 40 C180 75 180 105 180 130 Z" fill="url(#regLeafGradLeft)" />
                  <path d="M180 130 C192 100 192 65 180 40 C180 75 180 105 180 130 Z" fill="url(#regLeafGradRight)" />
                  <path d="M180 130 L180 44" stroke="#FFE9E6" stroke-width="1.2" opacity="0.75" />
                </g>

                <g transform="rotate(-30 128 140)">
                  <path d="M128 140 C110 115 108 80 125 55 C128 90 128 115 128 140 Z" fill="url(#regLeafGradLeft)" />
                  <path d="M128 140 C144 115 142 80 125 55 C128 90 128 115 128 140 Z" fill="url(#regLeafGradRight)" />
                  <path d="M128 140 L126 58" stroke="#FFE9E6" stroke-width="1.2" opacity="0.75" />
                </g>

                <g transform="rotate(30 238 140)">
                  <path d="M238 140 C222 115 220 80 238 55 C238 90 238 115 238 140 Z" fill="url(#regLeafGradLeft)" />
                  <path d="M238 140 C256 115 254 80 238 55 C238 90 238 115 238 140 Z" fill="url(#regLeafGradRight)" />
                  <path d="M238 140 L238 58" stroke="#FFE9E6" stroke-width="1.2" opacity="0.75" />
                </g>

                <g transform="rotate(-58 110 170)">
                  <path d="M110 170 C90 145 88 105 108 80 C110 115 110 145 110 170 Z" fill="url(#regLeafGradLeft)" />
                  <path d="M110 170 C128 145 126 105 108 80 C110 115 110 145 110 170 Z" fill="url(#regLeafGradRight)" />
                  <path d="M110 170 L109 83" stroke="#FFE9E6" stroke-width="1.2" opacity="0.75" />
                </g>

                <g transform="rotate(58 255 170)">
                  <path d="M255 170 C237 145 235 105 255 80 C255 115 255 145 255 170 Z" fill="url(#regLeafGradLeft)" />
                  <path d="M255 170 C275 145 273 105 255 80 C255 115 255 145 255 170 Z" fill="url(#regLeafGradRight)" />
                  <path d="M255 170 L255 83" stroke="#FFE9E6" stroke-width="1.2" opacity="0.75" />
                </g>
              </g>

              <!-- Blush Terracotta Ceramic Pot -->
              <g>
                <ellipse cx="180" cy="278" rx="46" ry="12" fill="#3D2928" />
                <ellipse cx="180" cy="276" rx="48" ry="12" fill="url(#regPotGrad)" />
                <ellipse cx="180" cy="276" rx="44" ry="10" fill="#452F2D" />
                <path d="M132 276 L144 332 C145 336 215 336 216 332 L228 276 Z" fill="url(#regPotGrad)" />
                <ellipse cx="180" cy="332" rx="36" ry="7" fill="#EAB9B0" />
                <path d="M142 280 L151 330 C154 332 162 332 164 330 L158 280 Z" fill="#FFFFFF" opacity="0.3" />
                <path d="M205 280 L198 330 C204 331 210 330 212 328 L223 280 Z" fill="#D3988E" opacity="0.45" />
              </g>
            </svg>
          </div>
        </div>

        <!-- RIGHT COLUMN: Elevated Minimalist White Register Card -->
        <div class="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end animate-fade-in-rise delay-100">
          
          <div class="w-full max-w-[500px] bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 md:p-11 shadow-[0_20px_60px_-15px_rgba(241,111,131,0.12),0_4px_24px_rgba(40,35,42,0.04)] border border-[#F3ECE8] relative">
            
            <!-- Card Header: Elegant Serif Heading & Coral Period -->
            <div class="mb-6">
              <h2 class="font-serif text-[38px] sm:text-[44px] leading-tight font-normal text-[#28232A] tracking-tight">
                Create account<span class="text-[#FF8A78]">.</span>
              </h2>
              <p class="mt-2 text-xs sm:text-[14px] text-[#88838C] font-normal leading-normal">
                Already have an account? 
                <a routerLink="/login" class="text-[#FF8A78] hover:text-[#F16F83] font-medium underline underline-offset-3 decoration-[#FF8A78]/40 transition-colors">Sign in</a>.
              </p>
            </div>

            <!-- Success Alert -->
            <div *ngIf="successMessage()" class="mb-5 bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs animate-fade-in-rise">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">{{ successMessage() }}</span>
            </div>

            <!-- Error Alert -->
            <div *ngIf="errorMessage()" class="mb-5 bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs animate-fade-in-rise">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="font-medium">{{ errorMessage() }}</span>
            </div>

            <!-- Registration Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
              
              <!-- Full Name Input Field -->
              <div class="space-y-1.5">
                <label for="name" class="sr-only">Full Name</label>
                <div class="relative flex items-center">
                  <!-- User Icon -->
                  <div class="absolute left-4 text-[#88838C] pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#88838C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <input 
                    id="name" 
                    type="text" 
                    formControlName="name"
                    placeholder="Full name"
                    class="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-[#E7DFDF] rounded-xl text-sm sm:text-[15px] text-[#28232A] placeholder-[#88838C]/70 focus:border-[#FF8A78] focus:ring-2 focus:ring-[#FF8A78]/20 focus:outline-none transition-all duration-200"
                    [class.border-red-400]="isFieldInvalid('name')"
                  >
                </div>
                <p *ngIf="isFieldInvalid('name')" class="text-[11px] text-red-500 font-medium pl-1">
                  Full Name must be at least 2 characters
                </p>
              </div>

              <!-- Email Input Field -->
              <div class="space-y-1.5">
                <label for="email" class="sr-only">Email address</label>
                <div class="relative flex items-center">
                  <!-- Mail Icon -->
                  <div class="absolute left-4 text-[#88838C] pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#88838C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <input 
                    id="email" 
                    type="email" 
                    formControlName="email"
                    placeholder="Email address"
                    class="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border border-[#E7DFDF] rounded-xl text-sm sm:text-[15px] text-[#28232A] placeholder-[#88838C]/70 focus:border-[#FF8A78] focus:ring-2 focus:ring-[#FF8A78]/20 focus:outline-none transition-all duration-200"
                    [class.border-red-400]="isFieldInvalid('email')"
                  >
                </div>
                <p *ngIf="isFieldInvalid('email')" class="text-[11px] text-red-500 font-medium pl-1">
                  Please enter a valid email address
                </p>
              </div>

              <!-- Password Input Field -->
              <div class="space-y-1.5">
                <label for="password" class="sr-only">Password</label>
                <div class="relative flex items-center">
                  <!-- Lock Icon -->
                  <div class="absolute left-4 text-[#88838C] pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#88838C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                  </div>

                  <input 
                    id="password" 
                    [type]="showPassword() ? 'text' : 'password'" 
                    formControlName="password"
                    placeholder="Password (min 6 characters)"
                    class="w-full pl-11 pr-11 py-3 sm:py-3.5 bg-white border border-[#E7DFDF] rounded-xl text-sm sm:text-[15px] text-[#28232A] placeholder-[#88838C]/70 focus:border-[#FF8A78] focus:ring-2 focus:ring-[#FF8A78]/20 focus:outline-none transition-all duration-200 tracking-wider"
                    [class.border-red-400]="isFieldInvalid('password')"
                  >

                  <!-- Eye Visibility Toggle -->
                  <button 
                    type="button" 
                    (click)="togglePasswordVisibility()" 
                    class="absolute right-3.5 text-[#88838C] hover:text-[#FF8A78] focus:outline-none p-1 transition-colors cursor-pointer"
                    tabindex="-1"
                    aria-label="Toggle password visibility"
                  >
                    <svg *ngIf="!showPassword()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg *ngIf="showPassword()" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  </button>
                </div>
                <p *ngIf="isFieldInvalid('password')" class="text-[11px] text-red-500 font-medium pl-1">
                  Password must be at least 6 characters
                </p>
              </div>

              <!-- Primary Sign-Up Button with Coral-to-Pink Gradient -->
              <div class="pt-2">
                <button 
                  type="submit" 
                  [disabled]="loading()"
                  class="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF8A78] to-[#F16F83] hover:from-[#f77e6b] hover:to-[#eb6075] text-white text-[15px] sm:text-base font-medium shadow-[0_10px_24px_-4px_rgba(255,138,120,0.4)] hover:shadow-[0_14px_28px_-4px_rgba(255,138,120,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A78]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg *ngIf="loading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading() ? 'Creating account...' : 'Get started free &rarr;' }}</span>
                </button>
              </div>

              <!-- Terms notice -->
              <p class="text-[11px] text-[#88838C] text-center pt-1 leading-normal">
                By creating an account, you agree to our 
                <span class="text-[#28232A] font-medium">Terms of Service</span> and 
                <span class="text-[#28232A] font-medium">Privacy Policy</span>.
              </p>

            </form>
          </div>
        </div>

      </main>

      <!-- Minimalist Bottom Footer with generous whitespace -->
      <footer class="w-full max-w-[1340px] mx-auto px-6 sm:px-12 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#88838C] z-10 relative flex-shrink-0 gap-2 sm:gap-0 mt-6 lg:mt-0">
        <p>&copy; 2026 BACHAT &middot; Personal Finance and Budget Management System</p>
        <div class="flex items-center gap-4">
          <a routerLink="/login" class="hover:text-[#FF8A78] transition-colors">Sign in</a>
          <span>&middot;</span>
          <span class="text-[#88838C]">Security &amp; Encryption</span>
        </div>
      </footer>

    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
    this.cdr.markForCheck();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cdr.markForCheck();

    const formVals = this.registerForm.value;
    const registerPayload = {
      name: (formVals.name || '').trim(),
      email: (formVals.email || '').trim().toLowerCase(),
      password: formVals.password,
      passwordHash: formVals.password,
      currencyPreference: 'INR'
    };

    this.authService.register(registerPayload).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created successfully! Redirecting to login...');
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/login'], { state: { email: registerPayload.email, registered: true } });
        }, 1200);
      },
      error: (err) => {
        this.loading.set(false);
        console.error(err);
        const msg = err?.error?.message || 'Registration failed. The email address might already be registered.';
        this.errorMessage.set(msg);
        this.cdr.markForCheck();
      }
    });
  }
}
