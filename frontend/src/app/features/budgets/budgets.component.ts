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
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">My Budgets</h1>
          <p class="text-text-sub text-sm mt-1">Enforce limits on your monthly expenditures by category.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Set Budget
        </button>
      </div>

      <!-- Aggregated Budget Metrics Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Monthly Limit</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalLimit | number:'1.2-2' }}</h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Actual Spent</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalSpent | number:'1.2-2' }}</h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Remaining</span>
          <h3 class="text-2xl font-black mt-1" [class.text-red-500]="totalLimit - totalSpent < 0">
            ₹{{ (totalLimit - totalSpent) | number:'1.2-2' }}
          </h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Budgets Count</span>
          <h3 class="text-2xl font-black mt-1">{{ budgets.length }} limits set</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div class="h-44 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2]"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && budgets.length === 0" class="bg-white border border-brand-border p-12 rounded-2xl text-center shadow-sm space-y-3">
        <p class="text-sm text-text-sub">You have not created any budget limits yet.</p>
        <button (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Set your first budget</button>
      </div>

      <!-- Budgets Grid -->
      <div *ngIf="!loading && budgets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          *ngFor="let b of budgetUtilList" 
          class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between h-48 hover:shadow transition-shadow duration-200"
        >
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-text-sub">Monthly Limit</span>
              <h3 class="text-lg font-bold text-text-main mt-0.5">{{ b.categoryName }}</h3>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="openEditModal(b)"
                class="text-xs font-bold text-brand-primary hover:text-brand-primary-dark"
              >
                Edit
              </button>
              <button 
                (click)="deleteBudget(b.budgetId)"
                class="text-xs font-bold text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Progress Bar & Warnings -->
          <div class="space-y-2 mt-4">
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-text-sub">Spent: ₹{{ b.actualSpent | number:'1.2-2' }}</span>
              <span class="text-text-main">Limit: ₹{{ b.limitAmount | number:'1.2-2' }}</span>
            </div>
            
            <div class="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden">
              <div 
                [class]="getProgressBarClass(b.utilizationPercentage)" 
                class="h-2.5 rounded-full transition-all duration-300"
                [style.width.%]="b.utilizationPercentage > 100 ? 100 : b.utilizationPercentage"
              ></div>
            </div>

            <div class="flex justify-between items-center text-[10px] font-bold mt-1">
              <span [class]="getWarningTextClass(b.utilizationPercentage)">
                {{ getWarningText(b.utilizationPercentage) }}
              </span>
              <span class="text-text-sub">{{ b.utilizationPercentage | number:'1.0-0' }}% Used</span>
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
            <!-- Category Selector -->
            <div>
              <label for="categoryId" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Expense Category</label>
              <select 
                id="categoryId"
                formControlName="categoryId"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="" disabled>Select Category</option>
                <option *ngFor="let cat of categories" [value]="cat.categoryId">{{ cat.categoryName }}</option>
              </select>
              <p *ngIf="isFieldInvalid('categoryId')" class="text-xs text-red-500 mt-1">Category selection is required</p>
            </div>

            <!-- Limit Amount -->
            <div>
              <label for="limitAmount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Monthly Spend Limit (₹)</label>
              <input 
                id="limitAmount" 
                type="number" 
                formControlName="limitAmount" 
                placeholder="e.g. 5000"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('limitAmount')" class="text-xs text-red-500 mt-1">Limit must be a positive number</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Period -->
              <div>
                <label for="period" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Cycle Period</label>
                <select 
                  id="period"
                  formControlName="period"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="DAILY">Daily</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <!-- Start Date -->
              <div>
                <label for="startDate" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  id="startDate" 
                  type="date" 
                  formControlName="startDate"
                  class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
              </div>
            </div>

            <!-- End Date -->
            <div>
              <label for="endDate" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">End Date</label>
              <input 
                id="endDate" 
                type="date" 
                formControlName="endDate"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button 
                type="button" 
                (click)="closeModal()" 
                class="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-text-sub hover:bg-brand-bg focus:outline-none"
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
  budgetUtilList: any[] = [];
  categories: any[] = [];
  
  loading = true;
  showModal = false;
  editingBudgetId: string | null = null;
  formSubmitting = false;
  userId = '';

  // Metrics
  totalLimit = 0;
  totalSpent = 0;

  budgetForm: FormGroup = this.fb.group({
    categoryId: ['', [Validators.required]],
    limitAmount: ['', [Validators.required, Validators.min(1)]],
    period: ['MONTHLY', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadBudgets();
    }
  }

  loadBudgets() {
    this.loading = true;
    this.totalLimit = 0;
    this.totalSpent = 0;

    // Load active categories for user
    this.budgetService.getCategories(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          // Filter categories to only show EXPENSE type for budgeting
          this.categories = res.data.filter((c: any) => c.type === 'EXPENSE');
        }
      }
    });

    // Load budgets
    this.budgetService.getBudgets(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.budgets = res.data;
          this.budgets.forEach(b => this.totalLimit += b.limitAmount || 0);
        }

        // Fetch live budget utilization report from ReportService
        this.reportService.getBudgetUtilizationReport(this.userId).subscribe({
          next: (utilRes: any) => {
            if (utilRes && utilRes.data) {
              this.budgetUtilList = utilRes.data;
              this.budgetUtilList.forEach(b => this.totalSpent += b.actualSpent || 0);
            }
            this.loading = false;
          },
          error: () => {
            // fallback if report service fails
            this.budgetUtilList = this.budgets.map(b => ({
              budgetId: b.budgetId,
              categoryName: b.category?.categoryName || 'Expense',
              limitAmount: b.limitAmount,
              actualSpent: 0,
              utilizationPercentage: 0,
              period: b.period,
              startDate: b.startDate,
              endDate: b.endDate
            }));
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading budgets', err);
        this.loading = false;
      }
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
    
    // Set default dates for current month
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
    // Find the original budget object to capture full data
    const original = this.budgets.find(b => b.budgetId === budgetUtil.budgetId);
    if (!original) return;

    this.editingBudgetId = original.budgetId;
    this.budgetForm.reset({
      categoryId: original.category?.categoryId || '',
      limitAmount: original.limitAmount,
      period: original.period,
      startDate: original.startDate,
      endDate: original.endDate
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
    const payload = {
      ...this.budgetForm.value,
      userId: this.userId
    };

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
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.loadBudgets();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete budget limit.');
        }
      });
    }
  }
}
