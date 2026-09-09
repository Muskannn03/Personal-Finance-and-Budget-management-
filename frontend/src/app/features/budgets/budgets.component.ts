import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { BudgetService } from '../../core/services/budget.service';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">My Budgets</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Enforce limits on your monthly expenditures by category.</p>
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

          <button 
            (click)="openAddModal()" 
            class="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Set Budget
          </button>
        </div>
      </div>

      <!-- Aggregated Budget Metrics Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Total Monthly Ceiling
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Monthly Limit</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalLimit | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Month-to-Date Spend
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Actual Spent</span>
          <h3 class="text-2xl font-black mt-1 text-orange-600">₹{{ totalSpent | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Remaining Cushion
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Remaining</span>
          <h3 class="text-2xl font-black mt-1" [class.text-red-500]="totalLimit - totalSpent < 0" [class.text-emerald-700]="totalLimit - totalSpent >= 0">
            ₹{{ (totalLimit - totalSpent) | number:'1.2-2' }}
          </h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-text-main bg-gray-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Active Categories
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Budgets Count</span>
          <h3 class="text-2xl font-black mt-1">{{ budgetUtilList.length }} limits set</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div class="h-44 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2]"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && budgetUtilList.length === 0" class="bg-white border border-brand-border p-12 rounded-2xl text-center shadow-sm space-y-3">
        <p class="text-sm text-text-sub">You have not created any budget limits yet.</p>
        <button (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Set your first budget</button>
      </div>

      <!-- Budgets Grid -->
      <div *ngIf="!loading && budgetUtilList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          *ngFor="let b of budgetUtilList" 
          class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200 relative overflow-hidden"
        >
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
            📍 Category Guardrail: Shows allocated cap, spent progress bar, and safety warnings
          </div>

          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">{{ b.period }}</span>
              <h3 class="text-lg font-bold text-text-main mt-0.5">{{ b.categoryName }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="openEditModal(b)" class="text-xs text-brand-primary hover:text-brand-primary-dark font-semibold">Edit</button>
              <button (click)="deleteBudget(b.budgetId)" class="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
            </div>
          </div>

          <!-- Progress Bar & Details -->
          <div class="space-y-2 mt-4">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-text-sub">₹{{ b.actualSpent | number:'1.0-0' }} spent</span>
              <span class="text-text-main">Limit: ₹{{ b.limitAmount | number:'1.0-0' }}</span>
            </div>

            <div class="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden border border-brand-border">
              <div 
                [class]="getProgressBarClass(b.utilizationPercentage)" 
                class="h-2.5 rounded-full transition-all duration-500 ease-out" 
                [style.width.%]="b.utilizationPercentage > 100 ? 100 : b.utilizationPercentage"
              ></div>
            </div>

            <div class="flex justify-between items-center text-[10px]">
              <span class="font-bold" [class]="getWarningTextClass(b.utilizationPercentage)">
                {{ getWarningText(b.utilizationPercentage) }} ({{ b.utilizationPercentage | number:'1.0-0' }}%)
              </span>
              <span class="text-text-sub">Remaining: ₹{{ (b.limitAmount - b.actualSpent > 0 ? b.limitAmount - b.actualSpent : 0) | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingBudgetId ? 'Edit Budget Limit' : 'Set Budget Limit' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="budgetForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Category -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Expense Category</label>
              <select 
                formControlName="categoryId"
                class="w-full px-3 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
                [class.border-red-400]="isFieldInvalid('categoryId')"
              >
                <option value="">Select Category</option>
                <option *ngFor="let cat of categories" [value]="cat.categoryId">{{ cat.categoryName }}</option>
              </select>
            </div>

            <!-- Limit Amount -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Spending Limit (₹)</label>
              <input 
                type="number" 
                step="0.01" 
                formControlName="limitAmount" 
                placeholder="e.g. 15000"
                class="w-full px-4 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-sm focus:outline-none focus:border-brand-primary"
                [class.border-red-400]="isFieldInvalid('limitAmount')"
              >
            </div>

            <!-- Period -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Period</label>
              <select 
                formControlName="period"
                class="w-full px-3 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button 
                type="button" 
                (click)="closeModal()"
                class="px-4 py-2.5 border border-brand-border hover:bg-brand-bg text-text-sub text-xs font-bold rounded-xl focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="formSubmitting"
                class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl focus:outline-none shadow-sm hover:shadow"
              >
                {{ formSubmitting ? 'Saving...' : 'Save Limit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class BudgetsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private budgetService = inject(BudgetService);
  private reportService = inject(ReportService);

  budgets: any[] = [];
  categories: any[] = [];
  budgetUtilList: any[] = [];

  loading = false;
  isDemoMode = true;
  showGuide = true;

  showModal = false;
  editingBudgetId: string | null = null;
  formSubmitting = false;
  userId = '';

  totalLimit = 38500;
  totalSpent = 28000;

  // Cached live data
  liveBudgets: any[] = [];
  liveBudgetUtilList: any[] = [];
  liveCategories: any[] = [];
  liveTotalLimit = 0;
  liveTotalSpent = 0;

  readonly demoCategories = [
    { categoryId: 'b-cat-1', categoryName: 'Groceries & Provisions' },
    { categoryId: 'b-cat-2', categoryName: 'Shopping & Fashion' },
    { categoryId: 'b-cat-3', categoryName: 'Dining & Cafes' },
    { categoryId: 'b-cat-4', categoryName: 'Utilities & Bills' },
    { categoryId: 'b-cat-5', categoryName: 'Entertainment & Movies' }
  ];

  readonly demoBudgets = [
    {
      budgetId: 'db-1',
      categoryName: 'Groceries & Provisions',
      limitAmount: 15000,
      actualSpent: 11200,
      utilizationPercentage: 74.67,
      period: 'MONTHLY'
    },
    {
      budgetId: 'db-2',
      categoryName: 'Shopping & Fashion',
      limitAmount: 10000,
      actualSpent: 8900,
      utilizationPercentage: 89.00,
      period: 'MONTHLY'
    },
    {
      budgetId: 'db-3',
      categoryName: 'Dining & Cafes',
      limitAmount: 6000,
      actualSpent: 2450,
      utilizationPercentage: 40.83,
      period: 'MONTHLY'
    },
    {
      budgetId: 'db-4',
      categoryName: 'Utilities & Bills',
      limitAmount: 4000,
      actualSpent: 1850,
      utilizationPercentage: 46.25,
      period: 'MONTHLY'
    },
    {
      budgetId: 'db-5',
      categoryName: 'Entertainment & Movies',
      limitAmount: 3500,
      actualSpent: 3600,
      utilizationPercentage: 102.85,
      period: 'MONTHLY'
    }
  ];

  budgetForm: FormGroup = this.fb.group({
    categoryId: ['', [Validators.required]],
    limitAmount: ['', [Validators.required, Validators.min(1)]],
    period: ['MONTHLY', [Validators.required]],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    // Apply demo by default
    this.applyDemoData();

    if (session) {
      this.loadCategories();
      this.loadBudgets();
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
    this.budgetUtilList = [...this.demoBudgets];
    this.categories = [...this.demoCategories];
    this.totalLimit = 38500;
    this.totalSpent = 28000;
    this.loading = false;
  }

  private applyLiveData() {
    this.budgetUtilList = [...this.liveBudgetUtilList];
    this.categories = [...this.liveCategories];
    this.totalLimit = this.liveTotalLimit;
    this.totalSpent = this.liveTotalSpent;
    this.loading = false;
  }

  loadCategories() {
    this.budgetService.getCategories(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveCategories = res.data;
          if (!this.isDemoMode) this.categories = res.data;
        }
      }
    });
  }

  loadBudgets() {
    this.budgetService.getBudgets(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveBudgets = res.data;
          this.liveTotalLimit = 0;
          this.liveBudgets.forEach(b => this.liveTotalLimit += b.limitAmount || 0);

          this.reportService.getBudgetUtilizationReport(this.userId).subscribe({
            next: (utilRes: any) => {
              if (utilRes && utilRes.data) {
                this.liveBudgetUtilList = utilRes.data;
                this.liveTotalSpent = 0;
                this.liveBudgetUtilList.forEach(b => this.liveTotalSpent += b.actualSpent || 0);
                if (!this.isDemoMode) {
                  this.applyLiveData();
                }
              }
            }
          });
        }
      },
      error: (err: any) => console.warn('Could not load live budgets', err)
    });
  }

  getProgressBarClass(utilPct: number): string {
    if (utilPct >= 90) return 'bg-red-500';
    if (utilPct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  getWarningTextClass(utilPct: number): string {
    if (utilPct >= 90) return 'text-red-500';
    if (utilPct >= 70) return 'text-amber-600';
    return 'text-emerald-600';
  }

  getWarningText(utilPct: number): string {
    if (utilPct >= 100) return '⚠️ Budget exceeded!';
    if (utilPct >= 90) return '🚨 Limit close!';
    if (utilPct >= 70) return '⚠️ Warning: Over 70%';
    return '✓ Within limits';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.budgetForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openAddModal() {
    this.editingBudgetId = null;
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 2).toISOString().substring(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().substring(0, 10);

    this.budgetForm.reset({
      categoryId: this.categories.length > 0 ? this.categories[0].categoryId : '',
      limitAmount: '',
      period: 'MONTHLY',
      startDate: firstDay,
      endDate: lastDay
    });
    this.showModal = true;
  }

  openEditModal(budgetUtil: any) {
    this.editingBudgetId = budgetUtil.budgetId;
    const foundCat = this.categories.find(c => c.categoryName === budgetUtil.categoryName);

    this.budgetForm.reset({
      categoryId: foundCat ? foundCat.categoryId : (this.categories[0]?.categoryId || ''),
      limitAmount: budgetUtil.limitAmount,
      period: budgetUtil.period || 'MONTHLY',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.budgetForm.invalid) {
      this.budgetForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.budgetForm.value;

    if (this.isDemoMode) {
      const cat = this.categories.find(c => c.categoryId === formVal.categoryId);
      const limit = parseFloat(formVal.limitAmount);
      const newBudget = {
        budgetId: 'db-' + Date.now(),
        categoryName: cat ? cat.categoryName : 'New Category',
        limitAmount: limit,
        actualSpent: 0,
        utilizationPercentage: 0,
        period: formVal.period
      };
      this.budgetUtilList.push(newBudget);
      this.totalLimit += limit;
      this.formSubmitting = false;
      this.closeModal();
      return;
    }

    const payload = { ...formVal, userId: this.userId };
    if (this.editingBudgetId) {
      this.budgetService.updateBudget(this.editingBudgetId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadBudgets();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update budget limit.');
        }
      });
    } else {
      this.budgetService.createBudget(payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadBudgets();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to set budget limit.');
        }
      });
    }
  }

  deleteBudget(id: string) {
    if (confirm('Are you sure you want to delete this budget limit?')) {
      if (this.isDemoMode) {
        const target = this.budgetUtilList.find(b => b.budgetId === id);
        if (target) {
          this.totalLimit -= target.limitAmount;
          this.totalSpent -= target.actualSpent;
        }
        this.budgetUtilList = this.budgetUtilList.filter(b => b.budgetId !== id);
        return;
      }
      this.budgetService.deleteBudget(id).subscribe({
        next: () => this.loadBudgets(),
        error: (err) => alert(err?.error?.message || 'Failed to delete budget limit.')
      });
    }
  }
}
