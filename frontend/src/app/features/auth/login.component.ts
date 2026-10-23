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
    <div class="min-h-screen lg:h-screen lg:max-h-screen bg-[#FFF9F5] text-[#28232A] font-sans relative overflow-x-hidden overflow-y-auto lg:overflow-hidden flex flex-col justify-between selection:bg-[#FF8A78]/20 selection:text-[#28232A]">
      
      <!-- Studio Interior Background: Diagonal French Window Light & Organic Waves -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <!-- Soft natural diagonal window slats cast across wall and floor -->
        <div class="absolute -top-32 -left-32 w-[900px] h-[1000px] window-light-pattern opacity-50 transform rotate-12 pointer-events-none"></div>

        <!-- Lower-Left Subtle Organic Blush Wave & Coral Line -->
        <svg class="absolute bottom-0 left-0 w-[360px] sm:w-[480px] lg:w-[600px] h-auto pointer-events-none select-none text-[#FCEAE6]" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-80 350 L-80 180 C40 160 120 220 200 240 C320 270 420 220 500 350 Z" fill="currentColor" fill-opacity="0.85" />
          <path d="M-80 230 C50 180 140 240 240 260 C360 280 440 230 500 350" stroke="#FF8A78" stroke-width="1.5" stroke-opacity="0.4" fill="none" />
        </svg>

        <!-- Lower-Right Subtle Organic Blush Wave & Coral Line -->
        <svg class="absolute bottom-0 right-0 w-[320px] sm:w-[420px] lg:w-[540px] h-auto pointer-events-none select-none text-[#FCEAE6]" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M580 350 L580 210 C460 190 380 250 280 250 C180 250 80 300 0 350 Z" fill="currentColor" fill-opacity="0.8" />
          <path d="M580 260 C440 210 360 270 260 270 C160 270 60 320 0 350" stroke="#FF8A78" stroke-width="1.5" stroke-opacity="0.35" fill="none" />
        </svg>

        <!-- Lower-Right Botanical Leaf Branch (Matching reference image) -->
        <svg class="absolute -bottom-4 right-0 w-32 sm:w-44 lg:w-56 h-auto pointer-events-none select-none" viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.75" transform="rotate(-12 160 240)">
            <!-- Branch stem -->
            <path d="M220 280 C180 220 140 140 150 40" stroke="#5A4750" stroke-width="2.5" stroke-linecap="round" opacity="0.3" />
            <!-- Soft shaded leaves -->
            <path d="M150 40 C138 12 118 8 108 28 C98 48 130 65 150 40 Z" fill="#FFA89E" />
            <path d="M150 40 C162 18 182 14 192 34 C198 54 165 65 150 40 Z" fill="#EE7886" />
            
            <path d="M145 92 C118 72 92 78 86 98 C80 118 124 122 145 92 Z" fill="#FFA89E" />
            <path d="M148 112 C176 92 202 98 208 118 C212 138 168 142 148 112 Z" fill="#EE7886" />

            <path d="M142 165 C108 145 82 155 76 176 C70 200 118 200 142 165 Z" fill="#FFA89E" />
            <path d="M146 185 C182 165 208 175 214 196 C220 220 172 220 146 185 Z" fill="#EE7886" />
          </g>
        </svg>

        <!-- Studio Horizon Floor Edge Line -->
        <div class="absolute bottom-[90px] sm:bottom-[110px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8DFD9]/70 to-transparent pointer-events-none"></div>
      </div>

      <!-- Top Header Navigation -->
      <header class="w-full max-w-[1340px] mx-auto px-6 sm:px-12 pt-6 sm:pt-8 flex items-start justify-between z-10 relative flex-shrink-0">
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
          <div class="w-7 h-[2px] bg-[#FF8A78] rounded-full mt-1.5"></div>
        </div>
      </header>

      <!-- Main Two-Column Editorial Hero Layout -->
      <main class="w-full max-w-[1340px] mx-auto px-6 sm:px-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10 relative flex-1 min-h-0">
        
        <!-- LEFT COLUMN: Poetic Typography & Botanical Potted Plant -->
        <div class="lg:col-span-6 xl:col-span-7 flex flex-col justify-between items-start lg:h-full py-2 sm:py-4 pr-0 lg:pr-8 animate-fade-in-rise">
          
          <!-- Editorial Serif Headline -->
          <div class="mb-2 sm:mb-4">
            <h1 class="font-serif text-3xl sm:text-5xl xl:text-[62px] leading-[1.08] font-normal tracking-tight text-[#28232A]">
              Small steps<br>
              <span class="text-[#FF8A78]">bigger savings.</span>
            </h1>
            <p class="mt-2 sm:mt-3 text-[#88838C] text-xs sm:text-[15px] font-normal max-w-sm leading-relaxed">
              Track your money, plan your goals<br class="hidden sm:inline"> and build the future you deserve.
            </p>
          </div>

          <!-- Realistic Potted Botanical Plant resting on Studio Floor Horizon -->
          <div class="hidden sm:flex w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[390px] h-[200px] sm:h-[250px] lg:h-[300px] relative items-end justify-start sm:ml-4 select-none">
            
            <svg viewBox="0 0 380 340" class="w-full h-full select-none overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Soft Wall Drop Shadow Filter -->
                <filter id="wallShadowRealistic" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="floorShadowRealistic" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>

                <!-- Ceramic Pot Shading Gradient (Matte Blush) -->
                <linearGradient id="ceramicPotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#FFF2EF" />
                  <stop offset="30%" stop-color="#FCEAE6" />
                  <stop offset="70%" stop-color="#F7D3CB" />
                  <stop offset="100%" stop-color="#E7B6AD" />
                </linearGradient>

                <!-- Lush Leaf Shading Gradients (Soft Coral/Pink Dual Tone) -->
                <linearGradient id="leafGradWarm" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFB3A8" />
                  <stop offset="100%" stop-color="#ED8490" />
                </linearGradient>
                <linearGradient id="leafGradDeep" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FCA69D" />
                  <stop offset="100%" stop-color="#DF6F7D" />
                </linearGradient>
              </defs>

              <!-- Soft Shadow on Wall Behind Plant (Cast towards Left/Back) -->
              <g filter="url(#wallShadowRealistic)" opacity="0.2">
                <ellipse cx="150" cy="220" rx="50" ry="45" fill="#28232A" />
                <ellipse cx="140" cy="150" rx="42" ry="60" fill="#28232A" />
                <path d="M150 260 L130 305 L175 305 Z" fill="#28232A" />
              </g>

              <!-- Floor Ground Contact Shadow -->
              <ellipse cx="190" cy="316" rx="80" ry="14" fill="#DAC8C5" opacity="0.75" filter="url(#floorShadowRealistic)" />
              <ellipse cx="190" cy="316" rx="55" ry="8" fill="#AF9A97" opacity="0.55" />

              <!-- Animated Plant Foliage & Stems (Gently swaying in natural air) -->
              <g class="animate-plant-sway" style="transform-origin: 190px 270px;">
                
                <!-- Main Stems (Thin Dark Organic Branches) -->
                <path d="M190 270 C190 230 190 160 190 100" stroke="#332B34" stroke-width="3" stroke-linecap="round" />
                <!-- Left branching stems -->
                <path d="M190 230 C172 195 138 165 110 150" stroke="#332B34" stroke-width="2.6" stroke-linecap="round" />
                <path d="M190 200 C175 168 150 140 128 120" stroke="#332B34" stroke-width="2.4" stroke-linecap="round" />
                <!-- Right branching stems -->
                <path d="M190 225 C208 195 242 165 270 150" stroke="#332B34" stroke-width="2.6" stroke-linecap="round" />
                <path d="M190 195 C205 168 230 140 252 120" stroke="#332B34" stroke-width="2.4" stroke-linecap="round" />

                <!-- Leaves: Ovate, Broad, Softly Shaded Botanical Leaves -->

                <!-- Top Center Leaf (Vertical) -->
                <g>
                  <path d="M190 110 C175 75 175 35 190 10 C190 50 190 85 190 110 Z" fill="url(#leafGradWarm)" />
                  <path d="M190 110 C205 75 205 35 190 10 C190 50 190 85 190 110 Z" fill="url(#leafGradDeep)" />
                  <path d="M190 110 L190 14" stroke="#FFF0ED" stroke-width="1.3" opacity="0.8" />
                </g>

                <!-- Upper Left Leaf -->
                <g transform="rotate(-32 128 120)">
                  <path d="M128 120 C106 90 102 50 124 20 C128 60 128 90 128 120 Z" fill="url(#leafGradWarm)" />
                  <path d="M128 120 C148 90 146 50 124 20 C128 60 128 90 128 120 Z" fill="url(#leafGradDeep)" />
                  <path d="M128 120 L125 24" stroke="#FFF0ED" stroke-width="1.3" opacity="0.8" />
                </g>

                <!-- Upper Right Leaf -->
                <g transform="rotate(32 252 120)">
                  <path d="M252 120 C232 90 230 50 252 20 C252 60 252 90 252 120 Z" fill="url(#leafGradWarm)" />
                  <path d="M252 120 C274 90 270 50 252 20 C252 60 252 90 252 120 Z" fill="url(#leafGradDeep)" />
                  <path d="M252 120 L252 24" stroke="#FFF0ED" stroke-width="1.3" opacity="0.8" />
                </g>

                <!-- Middle Left Leaf (Broad spread) -->
                <g transform="rotate(-60 110 150)">
                  <path d="M110 150 C86 120 84 75 108 45 C110 85 110 120 110 150 Z" fill="url(#leafGradWarm)" />
                  <path d="M110 150 C132 120 130 75 108 45 C110 85 110 120 110 150 Z" fill="url(#leafGradDeep)" />
                  <path d="M110 150 L109 49" stroke="#FFF0ED" stroke-width="1.3" opacity="0.8" />
                </g>

                <!-- Middle Right Leaf (Broad spread) -->
                <g transform="rotate(60 270 150)">
                  <path d="M270 150 C248 120 246 75 270 45 C270 85 270 120 270 150 Z" fill="url(#leafGradWarm)" />
                  <path d="M270 150 C294 120 292 75 270 45 C270 85 270 120 270 150 Z" fill="url(#leafGradDeep)" />
                  <path d="M270 150 L270 49" stroke="#FFF0ED" stroke-width="1.3" opacity="0.8" />
                </g>

                <!-- Lower Baby Leaves Near Pot Base -->
                <g transform="rotate(-18 168 195)">
                  <path d="M168 195 C150 170 150 135 168 112 C168 145 168 170 168 195 Z" fill="url(#leafGradWarm)" opacity="0.95" />
                  <path d="M168 195 C186 170 186 135 168 112 C168 145 168 170 168 195 Z" fill="url(#leafGradDeep)" opacity="0.95" />
                  <path d="M168 195 L168 116" stroke="#FFF0ED" stroke-width="1.1" opacity="0.75" />
                </g>

                <g transform="rotate(18 212 195)">
                  <path d="M212 195 C194 170 194 135 212 112 C212 145 212 170 212 195 Z" fill="url(#leafGradWarm)" opacity="0.95" />
                  <path d="M212 195 C230 170 230 135 212 112 C212 145 212 170 212 195 Z" fill="url(#leafGradDeep)" opacity="0.95" />
                  <path d="M212 195 L212 116" stroke="#FFF0ED" stroke-width="1.1" opacity="0.75" />
                </g>
              </g>

              <!-- Blush Terracotta Ceramic Pot (Realistic 3D Shading) -->
              <g>
                <!-- Pot Soil Interior -->
                <ellipse cx="190" cy="256" rx="50" ry="13" fill="#3D2928" />
                
                <!-- Pot Rim Upper Ring -->
                <ellipse cx="190" cy="254" rx="52" ry="13" fill="url(#ceramicPotGrad)" />
                <ellipse cx="190" cy="254" rx="47" ry="11" fill="#452F2D" />

                <!-- Pot Body (Slightly tapered cylindrical ceramic) -->
                <path d="M138 254 L151 312 C152 316 228 316 229 312 L242 254 Z" fill="url(#ceramicPotGrad)" />
                <!-- Pot Base Curve -->
                <ellipse cx="190" cy="312" rx="39" ry="7" fill="#E7B6AD" />

                <!-- Soft Highlight Reflection on Left -->
                <path d="M149 258 L159 310 C162 312 170 312 172 310 L166 258 Z" fill="#FFFFFF" opacity="0.32" />

                <!-- Soft Shadow on Right -->
                <path d="M218 258 L210 310 C216 311 222 310 224 308 L236 258 Z" fill="#D3988E" opacity="0.45" />
              </g>
            </svg>
          </div>
        </div>

        <!-- RIGHT COLUMN: Elevated Minimalist White Sign-In Card -->
        <div class="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end animate-fade-in-rise delay-100">
          
          <div class="w-full max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 md:p-9 shadow-[0_20px_50px_rgba(241,111,131,0.08),0_4px_20px_rgba(40,35,42,0.03)] border border-[#F3ECE8] relative">
            
            <!-- Card Header: Elegant Serif Heading & Coral Period -->
            <div class="mb-5 sm:mb-6">
              <h2 class="font-serif text-[34px] sm:text-[40px] leading-tight font-normal text-[#28232A] tracking-tight">
                Welcome back<span class="text-[#FF8A78]">.</span>
              </h2>
              <p class="mt-1.5 text-xs sm:text-[13px] text-[#88838C] font-normal leading-normal">
                Sign in to manage your budget, or 
                <a routerLink="/register" class="text-[#FF8A78] hover:text-[#F16F83] font-medium underline underline-offset-3 decoration-[#FF8A78]/40 transition-colors">create an account</a>.
              </p>
            </div>

            <!-- Active Session Notice (If already logged in) -->
            <div *ngIf="authService.isAuthenticated()" class="mb-4 bg-[#FFF6F4] border border-[#FCE2DC] text-[#7A3626] p-2.5 sm:p-3 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-xs">
              <div class="flex items-center gap-2 truncate">
                <span class="text-sm flex-shrink-0">👋</span>
                <div class="truncate">
                  <p class="font-bold uppercase tracking-wider text-[9px] text-[#FF8A78]">Active Session</p>
                  <p class="text-xs text-[#28232A] font-medium truncate">{{ authService.currentUser()?.email }}</p>
                </div>
              </div>
              <a routerLink="/dashboard" class="px-3 py-1 bg-[#FF8A78] hover:bg-[#F16F83] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1 flex-shrink-0 cursor-pointer">
                <span>Go to App</span>
                <span>&rarr;</span>
              </a>
            </div>

            <!-- Success Alert -->
            <div *ngIf="successMessage()" class="mb-4 bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-fade-in-rise">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">{{ successMessage() }}</span>
            </div>

            <!-- Error Alert -->
            <div *ngIf="errorMessage()" class="mb-4 bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-fade-in-rise">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="font-medium">{{ errorMessage() }}</span>
            </div>

            <!-- Sign-in Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-3.5">
              
              <!-- Email Input Field -->
              <div class="space-y-1">
                <label for="email" class="sr-only">Email address</label>
                <div class="relative flex items-center">
                  <!-- Mail Icon -->
                  <div class="absolute left-3.5 text-[#88838C] pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#88838C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <input 
                    id="email" 
                    type="email" 
                    formControlName="email"
                    placeholder="Email address"
                    class="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-[#E7DFDF] rounded-xl text-sm sm:text-[14px] text-[#28232A] placeholder-[#88838C]/70 focus:border-[#FF8A78] focus:ring-2 focus:ring-[#FF8A78]/20 focus:outline-none transition-all duration-200"
                    [class.border-red-400]="isFieldInvalid('email')"
                  >
                </div>
                <p *ngIf="isFieldInvalid('email')" class="text-[11px] text-red-500 font-medium pl-1">
                  Please enter a valid email address
                </p>
              </div>

              <!-- Password Input Field -->
              <div class="space-y-1">
                <label for="password" class="sr-only">Password</label>
                <div class="relative flex items-center">
                  <!-- Lock Icon -->
                  <div class="absolute left-3.5 text-[#88838C] pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#88838C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                  </div>

                  <input 
                    id="password" 
                    [type]="showPassword() ? 'text' : 'password'" 
                    formControlName="password"
                    placeholder="Password"
                    class="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-[#E7DFDF] rounded-xl text-sm sm:text-[14px] text-[#28232A] placeholder-[#88838C]/70 focus:border-[#FF8A78] focus:ring-2 focus:ring-[#FF8A78]/20 focus:outline-none transition-all duration-200 tracking-wider"
                    [class.border-red-400]="isFieldInvalid('password')"
                  >

                  <!-- Eye Visibility Toggle -->
                  <button 
                    type="button" 
                    (click)="togglePasswordVisibility()" 
                    class="absolute right-3 text-[#88838C] hover:text-[#FF8A78] focus:outline-none p-1 transition-colors cursor-pointer"
                    tabindex="-1"
                    aria-label="Toggle password visibility"
                  >
                    <!-- Eye Off / Crossed Icon (Default hidden) -->
                    <svg *ngIf="!showPassword()" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                    <!-- Eye Open Icon (Visible) -->
                    <svg *ngIf="showPassword()" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p *ngIf="isFieldInvalid('password')" class="text-[11px] text-red-500 font-medium pl-1">
                  Password is required
                </p>
              </div>

              <!-- Remember Me & Forgot Password Row -->
              <div class="flex items-center justify-between pt-0.5">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    formControlName="rememberMe" 
                    class="w-4 h-4 rounded text-[#FF8A78] focus:ring-[#FF8A78] border-[#E7DFDF] accent-[#FF8A78] cursor-pointer"
                  >
                  <span class="text-xs text-[#28232A] font-normal">Remember me</span>
                </label>

                <a (click)="forgotPasswordPlaceholder()" class="text-xs text-[#FF8A78] hover:text-[#F16F83] font-medium cursor-pointer transition-colors">
                  Forgot password?
                </a>
              </div>

              <!-- Primary Sign-In Button with Coral-to-Pink Gradient -->
              <div class="pt-1.5">
                <button 
                  type="submit" 
                  [disabled]="loading()"
                  class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF8A78] to-[#F16F83] hover:from-[#f77e6b] hover:to-[#eb6075] text-white text-[15px] font-medium shadow-[0_8px_20px_-3px_rgba(255,138,120,0.4)] hover:shadow-[0_12px_24px_-3px_rgba(255,138,120,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF8A78]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg *ngIf="loading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading() ? 'Signing in...' : 'Sign in &rarr;' }}</span>
                </button>
              </div>

              <!-- Divider: or continue with -->
              <div class="relative flex items-center justify-center py-1.5">
                <div class="border-t border-[#E7DFDF] w-full"></div>
                <span class="bg-white px-3 text-[11px] text-[#88838C] font-normal absolute">
                  or continue with
                </span>
              </div>

              <!-- Social Auth Buttons: Google & GitHub -->
              <div class="grid grid-cols-2 gap-3 pt-0.5">
                <!-- Google Button -->
                <button 
                  type="button" 
                  (click)="onSocialAuth('Google')"
                  class="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-[#FFF9F5] border border-[#E7DFDF] hover:border-[#FF8A78]/50 rounded-xl text-xs font-medium text-[#28232A] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <!-- Google G Logo SVG -->
                  <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span>Google</span>
                </button>

                <!-- GitHub Button -->
                <button 
                  type="button" 
                  (click)="onSocialAuth('GitHub')"
                  class="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-[#FFF9F5] border border-[#E7DFDF] hover:border-[#FF8A78]/50 rounded-xl text-xs font-medium text-[#28232A] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <!-- GitHub Mark SVG -->
                  <svg class="w-4 h-4 flex-shrink-0 text-[#28232A]" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </main>

      <!-- Minimalist Bottom Footer with generous whitespace -->
      <footer class="w-full max-w-[1340px] mx-auto px-6 sm:px-12 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#88838C] z-10 relative flex-shrink-0 gap-2 sm:gap-0 mt-6 lg:mt-0">
        <p>&copy; 2026 BACHAT &middot; Personal Finance and Budget Management System</p>
        <div class="flex items-center gap-4">
          <a routerLink="/register" class="hover:text-[#FF8A78] transition-colors">Register</a>
          <span>&middot;</span>
          <a (click)="forgotPasswordPlaceholder()" class="hover:text-[#FF8A78] cursor-pointer transition-colors">Privacy</a>
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
    email: ['kaprimuskan6@gmail.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [true]
  });

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  constructor() {
    // Check if user just registered or has email passed from route
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

  onSocialAuth(provider: string) {
    this.errorMessage.set('');
    this.successMessage.set(`${provider} authentication is coming soon. Please sign in with your email address and password.`);
    this.cdr.markForCheck();
  }

  forgotPasswordPlaceholder() {
    this.errorMessage.set('');
    this.successMessage.set("Please contact your system administrator or verify your registered email address.");
    this.cdr.markForCheck();
  }
}
