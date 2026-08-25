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
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Financial Analytics</h1>
          <p class="text-text-sub text-sm mt-1">Deep analysis of your spending habits, trends, and budget utilizations.</p>
        </div>
      </div>

      <!-- State: Loading -->
      <div *ngIf="loading" class="p-12 text-center text-xs text-text-sub">
        Compiling report analytics...
      </div>

      <!-- Dashboard grid -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Donut Category Spending -->
        <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 class="text-base font-bold">Category Distribution</h3>
            <p class="text-xs text-text-sub">Percentage of total expenditures</p>
          </div>

          <!-- SVG Donut Chart -->
          <div class="flex flex-col items-center justify-center space-y-6" *ngIf="spendingSegments.length > 0; else emptySpending">
            <div class="relative w-48 h-48">
              <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                <!-- Underlay circle -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFF9F7" stroke-width="12"></circle>
                <!-- Render segment stroke loops -->
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
        <div class="lg:col-span-2 bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 class="text-base font-bold">Monthly Trend Analysis</h3>
            <p class="text-xs text-text-sub">Comparison of Money In vs Money Out over the months</p>
          </div>

          <div class="h-64 flex flex-col justify-between pt-4" *ngIf="monthlyTrends.length > 0; else emptyTrends">
            <div class="flex-grow flex items-end justify-around relative px-4">
              <!-- Grid lines -->
              <div class="absolute inset-x-0 bottom-0 border-b border-brand-border opacity-50"></div>
              <div class="absolute inset-x-0 bottom-1/3 border-b border-brand-border opacity-25"></div>
              <div class="absolute inset-x-0 bottom-2/3 border-b border-brand-border opacity-25"></div>

              <!-- Loop trend bars -->
              <div *ngFor="let trend of monthlyTrends | slice:0:5" class="flex flex-col items-center gap-2">
                <div class="flex gap-1.5 items-end h-44">
                  <!-- Income Bar -->
                  <div 
                    class="w-5 bg-emerald-100 border border-emerald-300 rounded-lg relative flex items-end justify-center group hover:bg-emerald-200 transition-colors" 
                    [style.height.%]="getTrendHeight(trend.income)"
                    [title]="'Income: ₹' + trend.income"
                  >
                  </div>
                  <!-- Expense Bar -->
                  <div 
                    class="w-5 bg-orange-100 border border-orange-300 rounded-lg relative flex items-end justify-center group hover:bg-orange-200 transition-colors" 
                    [style.height.%]="getTrendHeight(trend.expense)"
                    [title]="'Expense: ₹' + trend.expense"
                  >
                  </div>
                </div>
                <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">{{ trend.month }}</span>
              </div>
            </div>
            
            <div class="flex justify-center gap-4 text-xs font-bold pt-2 border-t border-brand-border">
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
                <span>Money In</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                <span>Money Out</span>
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
      <div *ngIf="!loading" class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <h3 class="text-base font-bold">Enforced Budget Utilization</h3>
          <p class="text-xs text-text-sub">Actual spend vs configured limits by category</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="budgetUtilizations.length > 0; else emptyBudgets">
          <div *ngFor="let b of budgetUtilizations" class="p-4 bg-brand-bg border border-brand-border rounded-2xl space-y-3">
            <div class="flex justify-between items-start">
              <span class="text-xs font-bold text-text-main">{{ b.categoryName }}</span>
              <span class="text-[10px] text-text-sub uppercase tracking-wider">Monthly Cycle</span>
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
                <span>{{ b.utilizationPercentage | number:'1.0-0' }}% used</span>
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

  loading = true;
  userId = '';
  totalSpent = 0;
  
  spendingSegments: Segment[] = [];
  monthlyTrends: any[] = [];
  budgetUtilizations: any[] = [];

  // Donut Config
  donutColors = ['#E98FA3', '#C3B1E1', '#D6A2E8', '#FDE2E4', '#F9D423', '#3498db', '#8FB9A8'];

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadReportData();
    }
  }

  loadReportData() {
    this.loading = true;
    this.totalSpent = 0;
    this.spendingSegments = [];

    // Calculate dates for past 30 days
    const now = new Date();
    const endStr = now.toISOString().substring(0, 10);
    const prevMonth = new Date();
    prevMonth.setDate(now.getDate() - 30);
    const startStr = prevMonth.toISOString().substring(0, 10);

    // 1. Fetch category spending
    this.reportService.getCategorySpendingReport(this.userId, startStr, endStr).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const rawList = res.data || [];
          rawList.forEach((item: any) => this.totalSpent += item.amountSpent || 0);
          
          let cumulativePercentage = 0;
          this.spendingSegments = rawList.map((item: any, idx: number) => {
            const percentage = this.totalSpent > 0 ? (item.amountSpent / this.totalSpent) * 100 : 0;
            const colorHex = this.donutColors[idx % this.donutColors.length];
            
            // Math for dash array/offset: circle circumference = 251.32 (r=40)
            const circumference = 251.32;
            const strokeDashArray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashOffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += percentage;

            return {
              categoryName: item.categoryName,
              amountSpent: item.amountSpent,
              percentage,
              strokeDashArray,
              strokeDashOffset,
              colorClass: '',
              colorHex
            };
          });
        }

        // 2. Fetch monthly trends
        this.reportService.getMonthlyTrends(this.userId).subscribe({
          next: (trendRes: any) => {
            if (trendRes && trendRes.data) {
              this.monthlyTrends = trendRes.data.reverse(); // oldest first
            }

            // 3. Fetch budget utilizations
            this.reportService.getBudgetUtilizationReport(this.userId).subscribe({
              next: (utilRes: any) => {
                if (utilRes && utilRes.data) {
                  this.budgetUtilizations = utilRes.data;
                }
                this.loading = false;
              },
              error: () => { this.loading = false; }
            });
          },
          error: () => { this.loading = false; }
        });
      },
      error: (err) => {
        console.error('Error loading reports data', err);
        this.loading = false;
      }
    });
  }

  getTrendHeight(val: number): number {
    // Find the maximum value in trends to scale heights
    let max = 1;
    this.monthlyTrends.forEach(t => {
      max = Math.max(max, t.income || 0, t.expense || 0);
    });
    const height = (val / max) * 90;
    return height > 5 ? height : 5; // min height of 5%
  }

  getProgressBarClass(utilPct: number): string {
    if (utilPct >= 90) return 'bg-red-500';
    if (utilPct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  }
}
