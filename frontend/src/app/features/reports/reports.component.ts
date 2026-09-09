import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';

interface Segment {
  categoryName: string;
  amountSpent: number;
  percentage: number;
  strokeDashArray: string;
  strokeDashOffset: number;
  colorClass: string;
  colorHex: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Financial Analytics</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Deep analysis of your spending habits, trends, and budget utilizations.</p>
        </div>

        <!-- Controls: Demo Toggle & Guide Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <button 
            (click)="toggleGuide()" 
            class="text-xs font-semibold px-3.5 py-2 rounded-2xl border transition-all duration-200 flex items-center gap-1.5 shadow-sm"
            [ngClass]="showGuide ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-sub border-brand-border hover:bg-brand-bg'"
          >
            <span>💡</span>
            <span>{{ showGuide ? 'Hide Guide' : 'What is Where?' }}</span>
          </button>

          <div class="flex items-center bg-white border border-brand-border rounded-2xl p-1 shadow-sm">
            <button 
              (click)="setMode(true)" 
              class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150"
              [ngClass]="isDemoMode ? 'bg-brand-primary-light text-brand-primary-dark font-bold' : 'text-text-sub hover:text-text-main'"
            >
              Sample Data
            </button>
            <button 
              (click)="setMode(false)" 
              class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150"
              [ngClass]="!isDemoMode ? 'bg-brand-primary-light text-brand-primary-dark font-bold' : 'text-text-sub hover:text-text-main'"
            >
              Live Data
            </button>
          </div>
        </div>
      </div>

      <!-- State: Loading -->
      <div *ngIf="loading" class="p-12 text-center text-xs text-text-sub">
        Compiling report analytics...
      </div>

      <!-- Dashboard grid -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Donut Category Spending -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6 relative">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
            📍 Donut Chart: Proportional expense breakdown by category
          </div>
          <div>
            <h3 class="text-base font-bold">Category Distribution</h3>
            <p class="text-xs text-text-sub">Percentage of total expenditures</p>
          </div>

          <!-- SVG Donut Chart -->
          <div class="flex flex-col items-center justify-center space-y-6" *ngIf="spendingSegments.length > 0; else emptySpending">
            <div class="relative w-48 h-48">
              <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFF9F7" stroke-width="12"></circle>
                <circle 
                  *ngFor="let seg of spendingSegments" 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  [attr.stroke]="seg.colorHex" 
                  stroke-width="12"
                  [attr.stroke-dasharray]="seg.strokeDashArray"
                  [attr.stroke-dashoffset]="seg.strokeDashOffset"
                  stroke-linecap="round"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Spent</span>
                <span class="text-lg font-black text-brand-primary-dark">₹{{ totalSpent | number:'1.0-0' }}</span>
              </div>
            </div>

            <!-- Legend with percentages -->
            <div class="w-full space-y-2">
              <div *ngFor="let seg of spendingSegments" class="flex justify-between items-center text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" [style.background-color]="seg.colorHex"></div>
                  <span class="font-bold text-text-main">{{ seg.categoryName }}</span>
                </div>
                <span class="text-text-sub font-semibold">
                  {{ seg.percentage | number:'1.1-1' }}% (₹{{ seg.amountSpent | number:'1.0-0' }})
                </span>
              </div>
            </div>
          </div>

          <ng-template #emptySpending>
            <div class="text-center py-12 text-xs text-text-sub">
              No expenditures recorded in the active period.
            </div>
          </ng-template>
        </div>

        <!-- Monthly Trends bar comparison -->
        <div class="lg:col-span-2 bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6 relative">
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
            📍 Historical Inflow vs Outflow: 5-month cash flow momentum
          </div>
          <div>
            <h3 class="text-base font-bold">Monthly Trend Analysis</h3>
            <p class="text-xs text-text-sub">Comparison of Money In vs Money Out over previous months</p>
          </div>

          <div class="h-64 flex flex-col justify-between pt-4" *ngIf="monthlyTrends.length > 0; else emptyTrends">
            <div class="flex-grow flex items-end justify-around relative px-4">
              <!-- Grid lines -->
              <div class="absolute inset-x-0 bottom-0 border-b border-brand-border opacity-50"></div>
              <div class="absolute inset-x-0 bottom-1/3 border-b border-brand-border opacity-25"></div>
              <div class="absolute inset-x-0 bottom-2/3 border-b border-brand-border opacity-25"></div>

              <!-- Loop trend bars -->
              <div *ngFor="let trend of monthlyTrends | slice:0:5" class="flex flex-col items-center gap-2">
                <div class="flex gap-2 items-end h-44">
                  <!-- Income Bar -->
                  <div 
                    class="w-6 bg-emerald-100 border border-emerald-300 rounded-xl relative flex items-end justify-center group hover:bg-emerald-200 transition-colors" 
                    [style.height.%]="getTrendHeight(trend.income)"
                    [title]="'Income: ₹' + trend.income"
                  >
                  </div>
                  <!-- Expense Bar -->
                  <div 
                    class="w-6 bg-orange-100 border border-orange-300 rounded-xl relative flex items-end justify-center group hover:bg-orange-200 transition-colors" 
                    [style.height.%]="getTrendHeight(trend.expense)"
                    [title]="'Expense: ₹' + trend.expense"
                  >
                  </div>
                </div>
                <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">{{ trend.month }}</span>
              </div>
            </div>
            
            <div class="flex justify-center gap-6 text-xs font-bold pt-3 border-t border-brand-border">
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-md"></div>
                <span class="text-emerald-800">Money In (Earnings)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3.5 h-3.5 bg-orange-100 border border-orange-300 rounded-md"></div>
                <span class="text-orange-800">Money Out (Spending)</span>
              </div>
            </div>
          </div>

          <ng-template #emptyTrends>
            <div class="text-center py-16 text-xs text-text-sub">
              No historical trends found.
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Budget utilization list -->
      <div *ngIf="!loading" class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6 relative">
        <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
          📍 Budget Utilization Table: Real-time adherence to category expenditure caps
        </div>
        <div>
          <h3 class="text-base font-bold">Enforced Budget Utilization</h3>
          <p class="text-xs text-text-sub">Actual spend vs configured limits by category</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="budgetUtilizations.length > 0; else emptyBudgets">
          <div *ngFor="let b of budgetUtilizations" class="p-4 bg-brand-bg border border-brand-border rounded-2xl space-y-3">
            <div class="flex justify-between items-start">
              <span class="text-xs font-bold text-text-main">{{ b.categoryName }}</span>
              <span class="text-[10px] text-text-sub uppercase tracking-wider font-semibold">Monthly Limit</span>
            </div>
            
            <div class="space-y-1.5">
              <div class="w-full bg-white border border-brand-border rounded-full h-2">
                <div 
                  [class]="getProgressBarClass(b.utilizationPercentage)"
                  class="h-2 rounded-full transition-all duration-300"
                  [style.width.%]="b.utilizationPercentage > 100 ? 100 : b.utilizationPercentage"
                ></div>
              </div>
              <div class="flex justify-between text-[10px] text-text-sub">
                <span>Spent: ₹{{ b.actualSpent | number:'1.0-0' }} / ₹{{ b.limitAmount | number:'1.0-0' }}</span>
                <span class="font-bold" [class.text-red-500]="b.utilizationPercentage >= 90">{{ b.utilizationPercentage | number:'1.0-0' }}% used</span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyBudgets>
          <div class="text-center py-8 text-xs text-text-sub">
            No active budget limits to report.
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  private authService = inject(AuthService);
  private reportService = inject(ReportService);

  loading = false;
  isDemoMode = true;
  showGuide = true;
  userId = '';
  totalSpent = 34250;
  
  spendingSegments: Segment[] = [];
  monthlyTrends: any[] = [];
  budgetUtilizations: any[] = [];

  liveSpendingSegments: Segment[] = [];
  liveMonthlyTrends: any[] = [];
  liveBudgetUtilizations: any[] = [];
  liveTotalSpent = 0;

  donutColors = ['#E98FA3', '#C3B1E1', '#D6A2E8', '#FDE2E4', '#F9D423', '#3498db', '#8FB9A8'];

  // Demo datasets
  readonly demoSpendingRaw = [
    { categoryName: 'Groceries', amountSpent: 11200 },
    { categoryName: 'Shopping', amountSpent: 8900 },
    { categoryName: 'Housing & Rent', amountSpent: 6000 },
    { categoryName: 'Utilities & Bills', amountSpent: 4150 },
    { categoryName: 'Dining Out', amountSpent: 4000 }
  ];

  readonly demoMonthlyTrends = [
    { month: 'May 2026', income: 75000, expense: 38000 },
    { month: 'Jun 2026', income: 80000, expense: 42000 },
    { month: 'Jul 2026', income: 78000, expense: 35000 },
    { month: 'Aug 2026', income: 85000, expense: 39000 },
    { month: 'Sep 2026', income: 85000, expense: 34250 }
  ];

  readonly demoBudgetUtils = [
    { categoryName: 'Groceries & Provisions', actualSpent: 11200, limitAmount: 15000, utilizationPercentage: 74.67 },
    { categoryName: 'Shopping & Fashion', actualSpent: 8900, limitAmount: 10000, utilizationPercentage: 89.00 },
    { categoryName: 'Dining & Cafes', actualSpent: 2450, limitAmount: 6000, utilizationPercentage: 40.83 },
    { categoryName: 'Utilities & Bills', actualSpent: 1850, limitAmount: 4000, utilizationPercentage: 46.25 }
  ];

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadAnalytics();
    }
  }

  toggleGuide() {
    this.showGuide = !this.showGuide;
  }

  setMode(demo: boolean) {
    this.isDemoMode = demo;
    if (demo) {
      this.applyDemoData();
    } else {
      this.applyLiveData();
    }
  }

  private applyDemoData() {
    this.totalSpent = 34250;
    this.spendingSegments = this.calculateSegments(this.demoSpendingRaw);
    this.monthlyTrends = [...this.demoMonthlyTrends];
    this.budgetUtilizations = [...this.demoBudgetUtils];
    this.loading = false;
  }

  private applyLiveData() {
    this.totalSpent = this.liveTotalSpent;
    this.spendingSegments = [...this.liveSpendingSegments];
    this.monthlyTrends = [...this.liveMonthlyTrends];
    this.budgetUtilizations = [...this.liveBudgetUtilizations];
    this.loading = false;
  }

  loadAnalytics() {
    this.reportService.getCategorySpendingReport(this.userId, '', '').subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const rawSpending = res.data;
          this.liveTotalSpent = rawSpending.reduce((acc: number, curr: any) => acc + (curr.amountSpent || 0), 0);
          this.liveSpendingSegments = this.calculateSegments(rawSpending);
          if (!this.isDemoMode) {
            this.totalSpent = this.liveTotalSpent;
            this.spendingSegments = [...this.liveSpendingSegments];
          }
        }
      },
      error: (err: any) => console.warn('Could not load live spending', err)
    });

    this.reportService.getMonthlyTrends(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveMonthlyTrends = res.data;
          if (!this.isDemoMode) this.monthlyTrends = [...this.liveMonthlyTrends];
        }
      },
      error: (err: any) => console.warn('Could not load live monthly trend', err)
    });

    this.reportService.getBudgetUtilizationReport(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveBudgetUtilizations = res.data;
          if (!this.isDemoMode) this.budgetUtilizations = [...this.liveBudgetUtilizations];
        }
      },
      error: (err: any) => console.warn('Could not load live budget utilization', err)
    });
  }

  calculateSegments(data: any[]): Segment[] {
    const total = data.reduce((acc, curr) => acc + (curr.amountSpent || 0), 0);
    if (total === 0) return [];

    let accumulatedPercentage = 0;
    const circumference = 2 * Math.PI * 40; // r=40 -> ~251.32

    return data.map((item, index) => {
      const pct = (item.amountSpent / total) * 100;
      const strokeLength = (pct / 100) * circumference;
      const spaceLength = circumference - strokeLength;
      const offset = (accumulatedPercentage / 100) * circumference;
      accumulatedPercentage += pct;

      return {
        categoryName: item.categoryName,
        amountSpent: item.amountSpent,
        percentage: pct,
        strokeDashArray: `${strokeLength} ${spaceLength}`,
        strokeDashOffset: -offset,
        colorClass: '',
        colorHex: this.donutColors[index % this.donutColors.length]
      };
    });
  }

  getTrendHeight(val: number): number {
    const max = 95000;
    const pct = (val / max) * 100;
    return pct > 10 ? (pct > 100 ? 100 : pct) : 10;
  }

  getProgressBarClass(utilPct: number): string {
    if (utilPct >= 90) return 'bg-red-500';
    if (utilPct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  }
}
