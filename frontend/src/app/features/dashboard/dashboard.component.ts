import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Welcome & Tour Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">
              Good morning, {{ userName }} 👋
            </h1>
          </div>
          <p class="text-text-sub text-sm mt-1">Here is your financial overview for this month.</p>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Guide / Tour Highlighter Button -->
          <button 
            (click)="toggleGuide()" 
            class="text-xs font-semibold px-3.5 py-2 rounded-2xl border transition-all duration-200 flex items-center gap-1.5 shadow-sm"
            [ngClass]="showGuide ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-sub border-brand-border hover:bg-brand-bg'"
          >
            <span>💡</span>
            <span>{{ showGuide ? 'Hide Layout Guide' : 'What is Where? (Guide)' }}</span>
          </button>

          <span *ngIf="loading" class="text-xs font-semibold px-3 py-1.5 bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30 rounded-2xl flex items-center gap-1.5 animate-pulse">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
            Syncing...
          </span>

          <span class="text-xs font-semibold px-4 py-2 bg-white border border-brand-border rounded-2xl shadow-sm text-text-sub hidden sm:inline-block">
            {{ currentDate }}
          </span>
        </div>
      </div>

      <!-- Explanatory Banner (When Guide is Active) -->
      <div *ngIf="showGuide" class="p-5 rounded-2xl bg-gradient-to-r from-brand-primary-light/60 via-white to-purple-50 border border-brand-primary/40 shadow-sm transition-all animate-fadeIn">
        <div class="flex items-start gap-3">
          <span class="text-2xl">🗺️</span>
          <div>
            <h3 class="text-sm font-bold text-brand-primary-dark">Interactive Dashboard Guide</h3>
            <p class="text-xs text-text-sub mt-0.5 leading-relaxed">
              This dashboard organizes your personal finances into 6 key operational areas: 
              <b>Top KPIs</b> (Balance, Income, Expenses, Savings), 
              <b>Monthly Money Flow</b> (Inflow vs Outflow comparison chart), 
              <b>Recent Transactions</b> (Audit trail of money spent/earned), 
              <b>Quick Actions</b> (1-click shortcuts to add budgets or transactions), 
              <b>Savings Goals</b> (Milestone progress bars), and 
              <b>My Wallets</b> (Bank accounts, cards, and investment accounts).
            </p>
          </div>
        </div>
      </div>

      <!-- Dashboard Cards Grid (Top 4 KPIs) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Total Balance / Net Worth -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200 relative overflow-hidden">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2 py-0.5 rounded-md w-fit">
            📍 Total Liquid Net Worth
          </div>
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Available Balance</span>
              <p *ngIf="showGuide" class="text-[10px] text-text-sub mt-0.5">Sum of all bank + cash accounts</p>
            </div>
            <span class="p-2 rounded-xl bg-brand-primary-light text-brand-primary-dark">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-text-main">₹{{ netWorth | number:'1.2-2' }}</h3>
            <span class="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +3.8% this month
            </span>
          </div>
        </div>

        <!-- Card 2: Monthly Income -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md w-fit">
            📍 Cash Inflow / Earnings
          </div>
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Money In</span>
              <p *ngIf="showGuide" class="text-[10px] text-text-sub mt-0.5">Salary, freelance & returns</p>
            </div>
            <span class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-emerald-700">₹{{ monthlyIncome | number:'1.2-2' }}</h3>
            <span class="text-xs text-text-sub">Received this month</span>
          </div>
        </div>

        <!-- Card 3: Monthly Expenses -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md w-fit">
            📍 Cash Outflow / Spending
          </div>
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Money Out</span>
              <p *ngIf="showGuide" class="text-[10px] text-text-sub mt-0.5">Groceries, bills & shopping</p>
            </div>
            <span class="p-2 rounded-xl bg-orange-50 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-orange-600">₹{{ monthlyExpense | number:'1.2-2' }}</h3>
            <span class="text-xs text-text-sub">Spent this month</span>
          </div>
        </div>

        <!-- Card 4: Net Savings -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md w-fit">
            📍 Net Surplus Retained
          </div>
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Net Savings</span>
              <p *ngIf="showGuide" class="text-[10px] text-text-sub mt-0.5">Money In minus Money Out</p>
            </div>
            <span class="p-2 rounded-xl bg-purple-50 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-purple-700">
              ₹{{ (monthlyIncome - monthlyExpense > 0 ? monthlyIncome - monthlyExpense : 0) | number:'1.2-2' }}
            </h3>
            <span class="text-xs text-text-sub">Accumulated savings</span>
          </div>
        </div>
      </div>

      <!-- Main Visual Grid: Charts & Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Main Chart and Recent Transactions -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Income vs Expense Visualizer -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative space-y-6">
            <div *ngIf="showGuide" class="inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md">
              📍 Money Flow Graph: Visual comparison of monthly Inflow vs Outflow vs Savings
            </div>

            <!-- Card Header & Legend -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-text-main">Monthly Money Flow</h3>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                        [ngClass]="getSavingsShare() >= 50 
                          ? 'bg-brand-primary-light text-brand-primary-dark border border-brand-primary/40' 
                          : (getSavingsShare() >= 20 ? 'bg-[#FDE2E4] text-[#D96F88] border border-[#F8DDE4]' : 'bg-[#FDF2F0] text-[#E76F51] border border-[#F8C8BE]')">
                    {{ getFlowHealthLabel() }}
                  </span>
                </div>
                <p class="text-xs text-text-sub mt-0.5">Visual summary of your monthly spending vs earnings</p>
              </div>

              <!-- Legend -->
              <div class="flex items-center gap-3 text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-text-sub">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#8FB9A8] shadow-xs"></span> Income
                </span>
                <span class="flex items-center gap-1.5 text-text-sub">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#E76F51] shadow-xs"></span> Expenses
                </span>
                <span class="flex items-center gap-1.5 text-text-sub">
                  <span class="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-xs"></span> Savings
                </span>
              </div>
            </div>

            <!-- Modern Bar Chart Display Area (Theme Background & Borders) -->
            <div class="relative bg-brand-bg rounded-2xl p-6 border border-brand-border">
              <!-- Y-Axis Grid Reference Lines -->
              <div class="absolute inset-x-6 top-8 border-b border-dashed border-brand-border flex justify-between items-center text-[10px] text-text-sub font-medium pointer-events-none">
                <span>Peak Flow</span>
                <span>₹{{ getMaxFlow() | number:'1.0-0' }}</span>
              </div>
              <div class="absolute inset-x-6 top-1/2 border-b border-dashed border-brand-border flex justify-between items-center text-[10px] text-text-sub font-medium pointer-events-none">
                <span>50%</span>
                <span>₹{{ (getMaxFlow() / 2) | number:'1.0-0' }}</span>
              </div>
              <div class="absolute inset-x-6 bottom-20 border-b border-brand-border pointer-events-none"></div>

              <!-- Bar Columns Area (Fixed Height Track) -->
              <div class="h-60 flex items-end justify-around relative pt-8 pb-3 z-10">
                
                <!-- Income Column -->
                <div class="flex flex-col items-center gap-2 group w-24 sm:w-28">
                  <!-- Value Badge Above Bar -->
                  <div class="transition-transform duration-300 group-hover:-translate-y-1">
                    <span class="text-[11px] font-black text-[#4F7A6A] bg-white border border-[#C5DDD3] px-2.5 py-1 rounded-xl shadow-xs whitespace-nowrap">
                      ₹{{ monthlyIncome | number:'1.0-0' }}
                    </span>
                  </div>

                  <!-- Fixed Height Track (h-40) -->
                  <div class="w-16 sm:w-20 h-40 bg-white rounded-2xl p-1.5 flex items-end justify-center shadow-inner border border-brand-border group-hover:border-[#8FB9A8] group-hover:shadow-md transition-all">
                    <div 
                      class="w-full rounded-xl bg-gradient-to-t from-[#6EA490] via-[#8FB9A8] to-[#A8CEBF] shadow-sm shadow-[#8FB9A8]/30 transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-105"
                      [style.height.%]="getBarHeight(monthlyIncome)"
                    >
                      <div class="absolute top-1 inset-x-1 h-1 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  <!-- Bottom Label -->
                  <div class="text-center">
                    <span class="text-xs font-bold text-text-main flex items-center justify-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-[#8FB9A8]"></span> Income
                    </span>
                    <span class="text-[10px] font-semibold text-[#4F7A6A]">100% Inflow</span>
                  </div>
                </div>

                <!-- Expenses Column -->
                <div class="flex flex-col items-center gap-2 group w-24 sm:w-28">
                  <!-- Value Badge Above Bar -->
                  <div class="transition-transform duration-300 group-hover:-translate-y-1">
                    <span class="text-[11px] font-black text-[#C64A2F] bg-white border border-[#F8C8BE] px-2.5 py-1 rounded-xl shadow-xs whitespace-nowrap">
                      ₹{{ monthlyExpense | number:'1.0-0' }}
                    </span>
                  </div>

                  <!-- Fixed Height Track (h-40) -->
                  <div class="w-16 sm:w-20 h-40 bg-white rounded-2xl p-1.5 flex items-end justify-center shadow-inner border border-brand-border group-hover:border-[#E76F51] group-hover:shadow-md transition-all">
                    <div 
                      class="w-full rounded-xl bg-gradient-to-t from-[#D6593B] via-[#E76F51] to-[#F2947D] shadow-sm shadow-[#E76F51]/30 transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-105"
                      [style.height.%]="getBarHeight(monthlyExpense)"
                    >
                      <div class="absolute top-1 inset-x-1 h-1 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  <!-- Bottom Label -->
                  <div class="text-center">
                    <span class="text-xs font-bold text-text-main flex items-center justify-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-[#E76F51]"></span> Expenses
                    </span>
                    <span class="text-[10px] font-semibold text-[#C64A2F]">{{ getExpenseShare() | number:'1.1-1' }}% Spent</span>
                  </div>
                </div>

                <!-- Savings Column (Signature Brand Palette) -->
                <div class="flex flex-col items-center gap-2 group w-24 sm:w-28">
                  <!-- Value Badge Above Bar -->
                  <div class="transition-transform duration-300 group-hover:-translate-y-1">
                    <span class="text-[11px] font-black text-brand-primary-dark bg-white border border-brand-primary/50 px-2.5 py-1 rounded-xl shadow-xs whitespace-nowrap">
                      ₹{{ getNetSavings() | number:'1.0-0' }}
                    </span>
                  </div>

                  <!-- Fixed Height Track (h-40) -->
                  <div class="w-16 sm:w-20 h-40 bg-white rounded-2xl p-1.5 flex items-end justify-center shadow-inner border border-brand-border group-hover:border-brand-primary group-hover:shadow-md transition-all">
                    <div 
                      class="w-full rounded-xl bg-gradient-to-t from-brand-primary-dark via-brand-primary to-brand-primary-light shadow-sm shadow-brand-primary/40 transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-105"
                      [style.height.%]="getBarHeight(getNetSavings())"
                    >
                      <div class="absolute top-1 inset-x-1 h-1 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  <!-- Bottom Label -->
                  <div class="text-center">
                    <span class="text-xs font-bold text-text-main flex items-center justify-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-brand-primary"></span> Savings
                    </span>
                    <span class="text-[10px] font-semibold text-brand-primary-dark">{{ getSavingsShare() | number:'1.1-1' }}% Retained</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Flow Composition & Insights Bar -->
            <div class="p-4 rounded-xl bg-brand-bg border border-brand-border space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-text-main">Monthly Retention Split</span>
                <span class="font-semibold text-text-sub">
                  Savings Rate: <strong class="text-brand-primary-dark font-extrabold">{{ getSavingsShare() | number:'1.1-1' }}%</strong>
                </span>
              </div>

              <!-- Composite Horizontal Ratio Bar -->
              <div class="w-full h-3 bg-[#EFE6E8] rounded-full overflow-hidden flex shadow-inner">
                <div 
                  class="bg-gradient-to-r from-brand-primary-dark to-brand-primary h-full transition-all duration-500" 
                  [style.width.%]="getSavingsShare()"
                  [title]="'Savings: ' + (getSavingsShare() | number:'1.1-1') + '%'"
                ></div>
                <div 
                  class="bg-gradient-to-r from-[#D6593B] to-[#E76F51] h-full transition-all duration-500" 
                  [style.width.%]="getExpenseShare()"
                  [title]="'Expenses: ' + (getExpenseShare() | number:'1.1-1') + '%'"
                ></div>
              </div>

              <!-- Quick Metric Badges -->
              <div class="grid grid-cols-3 gap-2 pt-1 text-center">
                <div class="bg-white p-2.5 rounded-lg border border-brand-border shadow-xs">
                  <span class="text-[10px] text-text-sub uppercase font-bold block">Gross Inflow</span>
                  <span class="text-xs font-extrabold text-[#4F7A6A]">₹{{ monthlyIncome | number:'1.0-0' }}</span>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-brand-border shadow-xs">
                  <span class="text-[10px] text-text-sub uppercase font-bold block">Burn Rate</span>
                  <span class="text-xs font-extrabold text-[#C64A2F]">{{ getExpenseShare() | number:'1.1-1' }}%</span>
                </div>
                <div class="bg-brand-primary-light/40 p-2.5 rounded-lg border border-brand-primary/30 shadow-xs">
                  <span class="text-[10px] text-brand-primary-dark uppercase font-bold block">Net Retained</span>
                  <span class="text-xs font-black text-brand-primary-dark">+₹{{ getNetSavings() | number:'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative">
            <div *ngIf="showGuide" class="mb-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md">
              📍 Recent Transactions Ledger: Tracks all payments, receipts, tags, and accounts in real time
            </div>
            <div class="flex justify-between items-center mb-6">
              <div>
                <h3 class="text-base font-bold">Recent Transactions</h3>
                <p class="text-xs text-text-sub">Your latest cash movements</p>
              </div>
              <a routerLink="/transactions" class="text-xs font-bold text-brand-primary hover:text-brand-primary-dark flex items-center gap-1">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <!-- Transaction list -->
            <div class="space-y-3" *ngIf="recentTransactions.length > 0; else emptyTransactions">
              <div *ngFor="let t of recentTransactions" class="flex justify-between items-center p-3 rounded-2xl hover:bg-brand-bg transition-colors duration-150 border border-transparent hover:border-brand-border">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shadow-xs"
                       [class.bg-emerald-50]="t.type === 'INCOME'" [class.border-emerald-100]="t.type === 'INCOME'" [class.text-emerald-700]="t.type === 'INCOME'"
                       [class.bg-orange-50]="t.type === 'EXPENSE'" [class.border-orange-100]="t.type === 'EXPENSE'" [class.text-orange-600]="t.type === 'EXPENSE'">
                    {{ t.type === 'INCOME' ? '₹' : '▼' }}
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-text-main">{{ t.description || 'Transaction' }}</h4>
                    <p class="text-xs text-text-sub mt-0.5">
                      {{ t.date | date:'MMM d, h:mm a' }} &middot; 
                      <span class="font-medium text-text-main/80">{{ t.category?.categoryName || 'General' }}</span>
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-extrabold text-sm" [class.text-emerald-600]="t.type === 'INCOME'" [class.text-orange-600]="t.type === 'EXPENSE'">
                    {{ t.type === 'INCOME' ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
                  </span>
                  <p class="text-[11px] text-text-sub mt-0.5 font-medium">{{ t.account?.accountName || 'Cash' }}</p>
                </div>
              </div>
            </div>
            
            <ng-template #emptyTransactions>
              <div class="text-center py-10">
                <p class="text-sm text-text-sub">No transactions recorded yet.</p>
                <a routerLink="/transactions" class="text-xs text-brand-primary font-bold mt-2 inline-block">Add your first transaction</a>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Right 1 Col: Quick Actions & Goals -->
        <div class="space-y-8">
          
          <!-- Quick Actions -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative">
            <div *ngIf="showGuide" class="mb-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md">
              📍 Quick Actions: 1-click navigation shortcuts
            </div>
            <h3 class="text-base font-bold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <a routerLink="/transactions" class="p-3 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-brand-primary shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs font-bold">New Record</span>
              </a>
              <a routerLink="/budgets" class="p-3 bg-orange-50 hover:bg-brand-primary-dark text-orange-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-orange-200 shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                <span class="text-xs font-bold">Add Budget</span>
              </a>
              <a routerLink="/goals" class="p-3 bg-purple-50 hover:bg-brand-primary-dark text-purple-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-purple-200 shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-xs font-bold">Savings Goal</span>
              </a>
              <a routerLink="/risk-profile" class="p-3 bg-teal-50 hover:bg-brand-primary-dark text-teal-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-teal-200 shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="text-xs font-bold">Risk Test</span>
              </a>
            </div>
          </div>

          <!-- Budget Progress Tracker -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative">
            <div *ngIf="showGuide" class="mb-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md">
              📍 Savings Goals: Tracks progress against target funds & deadlines
            </div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold">Savings Goals</h3>
              <a routerLink="/goals" class="text-xs font-bold text-brand-primary hover:underline">View Goals</a>
            </div>

            <div class="space-y-4" *ngIf="goals.length > 0; else emptyGoals">
              <div *ngFor="let goal of goals | slice:0:3" class="space-y-1.5">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-text-main">{{ goal.goalName }}</span>
                  <span class="text-text-sub">₹{{ goal.currentAmount | number:'1.0-0' }} / ₹{{ goal.targetAmount | number:'1.0-0' }}</span>
                </div>
                <div class="w-full bg-brand-bg rounded-full h-2 overflow-hidden border border-brand-border">
                  <div 
                    class="bg-brand-primary h-2 rounded-full transition-all duration-500 ease-out" 
                    [style.width.%]="getGoalProgressPercentage(goal)"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] text-text-sub">
                  <span class="font-semibold text-brand-primary-dark">{{ getGoalProgressPercentage(goal) | number:'1.0-0' }}% completed</span>
                  <span>Target: {{ goal.targetDate | date:'MMM yyyy' }}</span>
                </div>
              </div>
            </div>
            
            <ng-template #emptyGoals>
              <div class="text-center py-6 text-xs text-text-sub">
                No savings goals created yet.
              </div>
            </ng-template>
          </div>

          <!-- Account quick balance -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative">
            <div *ngIf="showGuide" class="mb-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md">
              📍 My Wallets: Breakdown of all bank accounts, cards & investments
            </div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold">My Wallets</h3>
              <a routerLink="/accounts" class="text-xs font-bold text-brand-primary hover:underline">Manage</a>
            </div>

            <div class="space-y-3" *ngIf="accounts.length > 0; else emptyAccounts">
              <div *ngFor="let acc of accounts" class="flex justify-between items-center py-2.5 border-b border-brand-border last:border-b-0">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full flex-shrink-0" 
                       [class.bg-brand-primary]="acc.accountType === 'SAVINGS'"
                       [class.bg-purple-400]="acc.accountType === 'INVESTMENT'"
                       [class.bg-emerald-400]="acc.accountType === 'CHECKING'"
                       [class.bg-orange-400]="acc.accountType === 'CREDIT_CARD'"
                       [class.bg-amber-400]="acc.accountType === 'CASH'">
                  </div>
                  <div>
                    <span class="text-xs font-bold text-text-main block">{{ acc.accountName }}</span>
                    <span class="text-[10px] text-text-sub capitalize font-medium">{{ acc.accountType?.replace('_', ' ')?.toLowerCase() }}</span>
                  </div>
                </div>
                <span class="text-xs font-extrabold" [class.text-orange-600]="acc.balance < 0">
                  ₹{{ acc.balance | number:'1.2-2' }}
                </span>
              </div>
            </div>
            
            <ng-template #emptyAccounts>
              <div class="text-center py-6 text-xs text-text-sub">
                No accounts set up yet.
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private reportService = inject(ReportService);
  private transactionService = inject(TransactionService);
  private cdr = inject(ChangeDetectorRef);

  userName = 'User';
  currentDate = '';
  loading = false;
  showGuide = false;

  // Active view model defaults to 0 and empty lists
  netWorth = 0;
  monthlyIncome = 0;
  monthlyExpense = 0;
  accounts: any[] = [];
  goals: any[] = [];
  recentTransactions: any[] = [];

  ngOnInit() {
    const userId = this.authService.getUserId();
    const session = this.authService.currentUser();
    this.userName = session?.name || 'User';
    this.currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (userId) {
      this.restoreCachedData(userId);
      this.fetchLiveData(userId);
    }
  }

  private restoreCachedData(userId: string) {
    try {
      const cached = sessionStorage.getItem('dashboard_cache_' + userId);
      if (cached) {
        const d = JSON.parse(cached);
        this.netWorth = d.netWorth ?? 0;
        this.monthlyIncome = d.monthlyIncome ?? 0;
        this.monthlyExpense = d.monthlyExpense ?? 0;
        this.accounts = d.accounts || [];
        this.goals = d.goals || [];
        this.recentTransactions = d.recentTransactions || [];
      }
    } catch (e) {
      console.warn('Could not read cached dashboard data', e);
    }
  }

  private saveCachedData(userId: string) {
    try {
      const data = {
        netWorth: this.netWorth,
        monthlyIncome: this.monthlyIncome,
        monthlyExpense: this.monthlyExpense,
        accounts: this.accounts,
        goals: this.goals,
        recentTransactions: this.recentTransactions
      };
      sessionStorage.setItem('dashboard_cache_' + userId, JSON.stringify(data));
    } catch (e) {}
  }

  toggleGuide() {
    this.showGuide = !this.showGuide;
  }

  fetchLiveData(userId: string) {
    this.loading = true;
    this.reportService.getDashboardAnalytics(userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const d = res.data;
          this.netWorth = d.netWorth ?? 0;
          this.monthlyIncome = d.monthlyIncome ?? 0;
          this.monthlyExpense = d.monthlyExpense ?? 0;
          this.accounts = d.accounts || [];
          this.goals = d.goals || [];
          this.saveCachedData(userId);
        }
        this.loading = false;
        this.cdr.markForCheck();

        this.transactionService.getTransactions({ userId, size: 5, sort: 'date,desc' }).subscribe({
          next: (tRes: any) => {
            if (tRes && tRes.data && tRes.data.content) {
              this.recentTransactions = tRes.data.content;
              this.saveCachedData(userId);
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.warn('Could not load live transactions', err);
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.warn('Could not load live analytics', err);
      }
    });
  }

  getNetSavings(): number {
    return Math.max(0, this.monthlyIncome - this.monthlyExpense);
  }

  getBarHeight(val: number): number {
    const savings = this.getNetSavings();
    const maxVal = Math.max(this.monthlyIncome, this.monthlyExpense, savings, 1);
    if (val <= 0) return 6;
    const pct = (val / maxVal) * 92;
    return Math.max(10, Math.min(96, Math.round(pct)));
  }

  getSavingsShare(): number {
    if (this.monthlyIncome <= 0) return 0;
    const savings = this.getNetSavings();
    return Math.min(100, Math.max(0, (savings / this.monthlyIncome) * 100));
  }

  getMaxFlow(): number {
    return Math.max(this.monthlyIncome, this.monthlyExpense, this.getNetSavings(), 1);
  }

  getExpenseShare(): number {
    const total = Math.max(this.monthlyIncome, this.monthlyExpense);
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (this.monthlyExpense / total) * 100));
  }

  getFlowHealthLabel(): string {
    const savingsRate = this.getSavingsShare();
    if (savingsRate >= 70) return 'Super Saver 🚀';
    if (savingsRate >= 40) return 'Healthy Flow 👍';
    if (savingsRate >= 20) return 'Moderate Flow ⚖️';
    return 'High Spending ⚠️';
  }

  getPercentage(val: number): number {
    return this.getBarHeight(val);
  }

  getGoalProgressPercentage(goal: any): number {
    if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;
    return pct > 100 ? 100 : pct;
  }
}
