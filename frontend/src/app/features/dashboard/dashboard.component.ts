import { Component, OnInit, inject } from '@angular/core';
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
    <div class="space-y-8 text-text-main">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">
            Good morning, {{ userName }} 👋
          </h1>
          <p class="text-text-sub text-sm mt-1">Here is your financial overview for this month.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold px-4 py-2 bg-white border border-brand-border rounded-2xl shadow-sm text-text-sub">
            {{ currentDate }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        <div class="h-28 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2, 3, 4]"></div>
      </div>

      <!-- Dashboard Cards Grid -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Total Balance / Net Worth -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div class="flex justify-between items-start">
            <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Available Balance</span>
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
              +2.4% this week
            </span>
          </div>
        </div>

        <!-- Card 2: Monthly Income -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div class="flex justify-between items-start">
            <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Money In</span>
            <span class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-text-main">₹{{ monthlyIncome | number:'1.2-2' }}</h3>
            <span class="text-xs text-text-sub">Received this month</span>
          </div>
        </div>

        <!-- Card 3: Monthly Expenses -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div class="flex justify-between items-start">
            <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Money Out</span>
            <span class="p-2 rounded-xl bg-orange-50 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-text-main">₹{{ monthlyExpense | number:'1.2-2' }}</h3>
            <span class="text-xs text-text-sub">Spent this month</span>
          </div>
        </div>

        <!-- Card 4: Net Savings -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200">
          <div class="flex justify-between items-start">
            <span class="text-xs font-bold text-text-sub uppercase tracking-wider">Net Savings</span>
            <span class="p-2 rounded-xl bg-purple-50 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            </span>
          </div>
          <div class="mt-4">
            <h3 class="text-2xl font-black text-text-main">
              ₹{{ (monthlyIncome - monthlyExpense > 0 ? monthlyIncome - monthlyExpense : 0) | number:'1.2-2' }}
            </h3>
            <span class="text-xs text-text-sub">Accumulated savings</span>
          </div>
        </div>
      </div>

      <!-- Main Visual Grid: Charts & Details -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Main Chart and Recent Transactions -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Income vs Expense Visualizer -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="text-base font-bold">Monthly Money Flow</h3>
                <p class="text-xs text-text-sub">Visual summary of your monthly spending vs earnings</p>
              </div>
            </div>

            <!-- Custom Clean Responsive SVG Chart -->
            <div class="h-64 flex flex-col justify-between pt-4">
              <div class="flex-grow flex items-end justify-between relative px-2">
                <!-- Guide lines -->
                <div class="absolute inset-x-0 bottom-0 border-b border-brand-border opacity-50"></div>
                <div class="absolute inset-x-0 bottom-1/3 border-b border-brand-border opacity-25"></div>
                <div class="absolute inset-x-0 bottom-2/3 border-b border-brand-border opacity-25"></div>
                
                <!-- Dynamic Bar Chart elements -->
                <div class="flex flex-col items-center gap-2 w-1/4">
                  <div class="w-16 bg-emerald-100 border border-emerald-300 rounded-xl relative flex items-end justify-center transition-all duration-500 ease-out" [style.height.%]="getPercentage(monthlyIncome)">
                    <span class="text-[10px] font-bold text-emerald-800 mb-1">₹{{ monthlyIncome | number:'1.0-0' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-text-sub">Income</span>
                </div>

                <div class="flex flex-col items-center gap-2 w-1/4">
                  <div class="w-16 bg-orange-100 border border-orange-300 rounded-xl relative flex items-end justify-center transition-all duration-500 ease-out" [style.height.%]="getPercentage(monthlyExpense)">
                    <span class="text-[10px] font-bold text-orange-700 mb-1">₹{{ monthlyExpense | number:'1.0-0' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-text-sub">Expenses</span>
                </div>

                <div class="flex flex-col items-center gap-2 w-1/4">
                  <div class="w-16 bg-purple-100 border border-purple-300 rounded-xl relative flex items-end justify-center transition-all duration-500 ease-out" [style.height.%]="getPercentage(monthlyIncome - monthlyExpense)">
                    <span class="text-[10px] font-bold text-purple-700 mb-1">₹{{ (monthlyIncome - monthlyExpense) | number:'1.0-0' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-text-sub">Savings</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
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
            <div class="space-y-4" *ngIf="recentTransactions.length > 0; else emptyTransactions">
              <div *ngFor="let t of recentTransactions" class="flex justify-between items-center p-3 rounded-2xl hover:bg-brand-bg transition-colors duration-150">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border"
                       [class.bg-emerald-50]="t.type === 'INCOME'" [class.border-emerald-100]="t.type === 'INCOME'" [class.text-emerald-700]="t.type === 'INCOME'"
                       [class.bg-orange-50]="t.type === 'EXPENSE'" [class.border-orange-100]="t.type === 'EXPENSE'" [class.text-orange-600]="t.type === 'EXPENSE'">
                    {{ t.type === 'INCOME' ? '₹' : '▼' }}
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-text-main">{{ t.description || 'Transaction' }}</h4>
                    <p class="text-xs text-text-sub mt-0.5">
                      {{ t.date | date:'MMM d, h:mm a' }} &middot; {{ t.category?.categoryName || 'General' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="font-extrabold text-sm" [class.text-emerald-600]="t.type === 'INCOME'" [class.text-orange-600]="t.type === 'EXPENSE'">
                    {{ t.type === 'INCOME' ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
                  </span>
                  <p class="text-[10px] text-text-sub mt-0.5">{{ t.account?.accountName || 'Cash' }}</p>
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
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
            <h3 class="text-base font-bold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <a routerLink="/transactions" class="p-3 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs font-bold">New Record</span>
              </a>
              <a routerLink="/budgets" class="p-3 bg-orange-50 hover:bg-brand-primary-dark text-orange-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-orange-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
                <span class="text-xs font-bold">Add Budget</span>
              </a>
              <a routerLink="/goals" class="p-3 bg-purple-50 hover:bg-brand-primary-dark text-purple-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-purple-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-xs font-bold">Savings Goal</span>
              </a>
              <a routerLink="/risk-profile" class="p-3 bg-teal-50 hover:bg-brand-primary-dark text-teal-600 hover:text-white rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border border-teal-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-13.32 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="text-xs font-bold">Risk Test</span>
              </a>
            </div>
          </div>

          <!-- Budget Progress Tracker -->
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold">Goal Progress</h3>
              <a routerLink="/goals" class="text-xs font-bold text-brand-primary hover:underline">View Goals</a>
            </div>

            <div class="space-y-4" *ngIf="goals.length > 0; else emptyGoals">
              <div *ngFor="let goal of goals | slice:0:3" class="space-y-1.5">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-text-main">{{ goal.goalName }}</span>
                  <span class="text-text-sub">₹{{ goal.currentAmount }} / ₹{{ goal.targetAmount }}</span>
                </div>
                <div class="w-full bg-brand-bg rounded-full h-2">
                  <div 
                    class="bg-brand-primary h-2 rounded-full transition-all duration-300" 
                    [style.width.%]="getGoalProgressPercentage(goal)"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] text-text-sub">
                  <span>{{ getGoalProgressPercentage(goal) | number:'1.0-0' }}% completed</span>
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
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold">My Wallets</h3>
              <a routerLink="/accounts" class="text-xs font-bold text-brand-primary hover:underline">Manage</a>
            </div>

            <div class="space-y-3" *ngIf="accounts.length > 0; else emptyAccounts">
              <div *ngFor="let acc of accounts" class="flex justify-between items-center py-2 border-b border-brand-border last:border-b-0">
                <div class="flex items-center gap-3">
                  <div class="w-2.5 h-2.5 rounded-full" 
                       [class.bg-brand-primary]="acc.accountType === 'SAVINGS'"
                       [class.bg-purple-400]="acc.accountType === 'INVESTMENT'"
                       [class.bg-emerald-400]="acc.accountType === 'CHECKING'"
                       [class.bg-orange-400]="acc.accountType === 'CREDIT_CARD'"
                       [class.bg-yellow-400]="acc.accountType === 'CASH'">
                  </div>
                  <span class="text-xs font-bold text-text-main">{{ acc.accountName }}</span>
                </div>
                <span class="text-xs font-extrabold">₹{{ acc.balance | number:'1.2-2' }}</span>
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

  userName = '';
  currentDate = '';
  loading = true;

  netWorth = 0;
  monthlyIncome = 0;
  monthlyExpense = 0;
  accounts: any[] = [];
  goals: any[] = [];
  recentTransactions: any[] = [];

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userName = session ? session.name : 'User';
    this.currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (session) {
      this.loadDashboardData(session.userId);
    }
  }

  loadDashboardData(userId: string) {
    this.loading = true;
    
    // Fetch dashboard analytics
    this.reportService.getDashboardAnalytics(userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const d = res.data;
          this.netWorth = d.netWorth || 0;
          this.monthlyIncome = d.monthlyIncome || 0;
          this.monthlyExpense = d.monthlyExpense || 0;
          this.accounts = d.accounts || [];
          this.goals = d.goals || [];
        }
        
        // Fetch 5 recent transactions
        this.transactionService.getTransactions({ userId, size: 5, sort: 'date,desc' }).subscribe({
          next: (tRes: any) => {
            if (tRes && tRes.data && tRes.data.content) {
              this.recentTransactions = tRes.data.content;
            }
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading transactions', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading dashboard analytics', err);
        this.loading = false;
      }
    });
  }

  getPercentage(val: number): number {
    const maxVal = Math.max(this.monthlyIncome, this.monthlyExpense, this.monthlyIncome - this.monthlyExpense, 1);
    const pct = (val / maxVal) * 80; // capped at 80% height for spacing
    return pct > 10 ? pct : 10; // min 10% height
  }

  getGoalProgressPercentage(goal: any): number {
    if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;
    return pct > 100 ? 100 : pct;
  }
}
