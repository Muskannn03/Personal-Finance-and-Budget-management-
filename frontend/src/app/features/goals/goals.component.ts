import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { GoalService } from '../../core/services/goal.service';
import { InvestmentService } from '../../core/services/investment.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Savings Goals</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Set milestones for things you want to purchase or save for.</p>
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
            Create Goal
          </button>
        </div>
      </div>

      <!-- Aggregated Goals Metrics Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Target Accumulated Amount
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Targets</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalTargetAmount | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Current Progress Saved
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Saved So Far</span>
          <h3 class="text-2xl font-black mt-1 text-emerald-700">₹{{ totalSavedAmount | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Overall Completion Rate
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Overall Completion</span>
          <h3 class="text-2xl font-black mt-1 text-purple-700">{{ (totalSavedAmount / totalTargetAmount * 100) | number:'1.0-0' }}%</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div class="h-56 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2]"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && goals.length === 0" class="bg-white border border-brand-border p-12 rounded-2xl text-center shadow-sm space-y-3">
        <p class="text-sm text-text-sub">No savings goals created yet. Let's start saving for something big!</p>
        <button (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Set your first savings goal</button>
      </div>

      <!-- Goals Grid -->
      <div *ngIf="!loading && goals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let goal of goals" 
          class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200 relative overflow-hidden"
        >
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
            📍 Milestone Bucket: Progress against target deadline
          </div>

          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-brand-primary-light text-brand-primary-dark font-extrabold flex items-center justify-center border border-brand-border text-lg shadow-sm">
                🎯
              </div>
              <div>
                <h3 class="text-base font-bold text-text-main leading-tight">{{ goal.goalName }}</h3>
                <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">
                  Target: {{ goal.targetDate | date:'MMM yyyy' }}
                </span>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button (click)="openEditModal(goal)" class="text-xs text-brand-primary hover:text-brand-primary-dark font-semibold">Edit</button>
              <button (click)="deleteGoal(goal.goalId)" class="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2 mt-4">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-text-sub">Saved: ₹{{ goal.currentAmount | number:'1.2-2' }}</span>
              <span class="text-text-main">Target: ₹{{ goal.targetAmount | number:'1.2-2' }}</span>
            </div>

            <div class="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden border border-brand-border">
              <div 
                [class.bg-emerald-500]="goal.status === 'ACHIEVED'"
                [class.bg-brand-primary]="goal.status === 'IN_PROGRESS'"
                [class.bg-red-500]="goal.status === 'FAILED'"
                class="h-2.5 rounded-full transition-all duration-500 ease-out"
                [style.width.%]="getProgressPercentage(goal)"
              ></div>
            </div>

            <div class="flex justify-between items-center text-[10px] font-bold mt-1">
              <span [class.text-emerald-700]="goal.status === 'ACHIEVED'"
                    [class.text-brand-primary-dark]="goal.status === 'IN_PROGRESS'"
                    [class.text-red-500]="goal.status === 'FAILED'">
                {{ goal.status === 'ACHIEVED' ? '🎉 Achieved!' : goal.status === 'FAILED' ? '❌ Failed' : '🕒 In Progress' }}
              </span>
              <span class="text-text-sub">{{ getProgressPercentage(goal) | number:'1.0-0' }}% Completed</span>
            </div>
          </div>

          <!-- Add Money trigger -->
          <div class="mt-4 pt-4 border-t border-brand-border flex justify-between items-center">
            <span class="text-xs text-text-sub">Linked Growth Deposit</span>
            <button 
              *ngIf="goal.status === 'IN_PROGRESS'"
              (click)="openAddMoneyModal(goal)" 
              class="px-3.5 py-1.5 bg-brand-primary-light hover:bg-brand-primary text-brand-primary-dark hover:text-white rounded-xl text-xs font-bold border border-brand-primary transition-colors focus:outline-none"
            >
              💸 Add Money
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Goal Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingGoalId ? 'Edit Savings Goal' : 'Create Savings Goal' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="goalForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Goal Milestone Name</label>
              <input 
                type="text" 
                formControlName="goalName" 
                placeholder="e.g. Buy a Laptop, Travel Fund"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Target Amount (₹)</label>
              <input 
                type="number" 
                formControlName="targetAmount" 
                placeholder="e.g. 50000"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Target Completion Date</label>
              <input 
                type="date" 
                formControlName="targetDate"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

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
                {{ formSubmitting ? 'Saving...' : 'Save Goal' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Money Modal (Overlay) -->
      <div *ngIf="showAddMoneyModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-base font-bold">Add Funds to {{ selectedGoal?.goalName }}</h3>
            <button (click)="closeAddMoneyModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              ✕
            </button>
          </div>

          <form [formGroup]="addMoneyForm" (ngSubmit)="onAddMoneySubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Contribution Amount (₹)</label>
              <input 
                type="number" 
                formControlName="amount" 
                placeholder="0.00"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Investment Deposit Vehicle</label>
              <select 
                formControlName="type"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
              >
                <option value="RECURRING_DEPOSIT">Recurring Deposit (RD)</option>
                <option value="MUTUAL_FUND">Mutual Fund / SIP</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit (FD)</option>
                <option value="STOCKS">Equity / Stocks</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button 
                type="button" 
                (click)="closeAddMoneyModal()"
                class="px-4 py-2.5 border border-brand-border hover:bg-brand-bg text-text-sub text-xs font-bold rounded-xl focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="formSubmitting"
                class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl focus:outline-none shadow-sm hover:shadow"
              >
                Deposit Funds
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class GoalsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private goalService = inject(GoalService);
  private investmentService = inject(InvestmentService);

  goals: any[] = [];
  loading = false;
  isDemoMode = true;
  showGuide = true;

  totalTargetAmount = 260000;
  totalSavedAmount = 181500;

  showModal = false;
  showAddMoneyModal = false;
  editingGoalId: string | null = null;
  selectedGoal: any = null;
  formSubmitting = false;
  userId = '';

  liveGoals: any[] = [];
  liveTotalTargetAmount = 0;
  liveTotalSavedAmount = 0;

  readonly demoGoals = [
    {
      goalId: 'dg-1',
      goalName: 'Emergency Fund (6 Months Cushion)',
      targetAmount: 100000,
      currentAmount: 75000,
      targetDate: '2026-12-31',
      status: 'IN_PROGRESS'
    },
    {
      goalId: 'dg-2',
      goalName: 'Apple MacBook Pro M3 Max',
      targetAmount: 90000,
      currentAmount: 58000,
      targetDate: '2026-11-30',
      status: 'IN_PROGRESS'
    },
    {
      goalId: 'dg-3',
      goalName: 'Goa Winter Vacation Trip',
      targetAmount: 35000,
      currentAmount: 24500,
      targetDate: '2027-01-15',
      status: 'IN_PROGRESS'
    },
    {
      goalId: 'dg-4',
      goalName: 'iPhone 16 Pro Upgrade Fund',
      targetAmount: 35000,
      currentAmount: 35000,
      targetDate: '2026-08-15',
      status: 'ACHIEVED'
    }
  ];

  goalForm: FormGroup = this.fb.group({
    goalName: ['', [Validators.required]],
    targetAmount: ['', [Validators.required, Validators.min(1)]],
    targetDate: ['', [Validators.required]]
  });

  addMoneyForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    type: ['MUTUAL_FUND', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadGoals();
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
    this.goals = [...this.demoGoals];
    this.recalculateTotals();
    this.loading = false;
  }

  private applyLiveData() {
    this.goals = [...this.liveGoals];
    this.totalTargetAmount = this.liveTotalTargetAmount;
    this.totalSavedAmount = this.liveTotalSavedAmount;
    this.loading = false;
  }

  private recalculateTotals() {
    this.totalTargetAmount = 0;
    this.totalSavedAmount = 0;
    this.goals.forEach(g => {
      this.totalTargetAmount += g.targetAmount || 0;
      this.totalSavedAmount += g.currentAmount || 0;
    });
  }

  loadGoals() {
    this.goalService.getGoals(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveGoals = res.data;
          this.liveTotalTargetAmount = 0;
          this.liveTotalSavedAmount = 0;
          this.liveGoals.forEach(g => {
            this.liveTotalTargetAmount += g.targetAmount || 0;
            this.liveTotalSavedAmount += g.currentAmount || 0;
          });
          if (!this.isDemoMode) {
            this.applyLiveData();
          }
        }
      },
      error: (err) => console.warn('Could not load live goals', err)
    });
  }

  getProgressPercentage(goal: any): number {
    if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;
    return pct > 100 ? 100 : pct;
  }

  openAddModal() {
    this.editingGoalId = null;
    this.goalForm.reset({
      goalName: '',
      targetAmount: '',
      targetDate: new Date(Date.now() + 180 * 86400000).toISOString().substring(0, 10)
    });
    this.showModal = true;
  }

  openEditModal(goal: any) {
    this.editingGoalId = goal.goalId;
    this.goalForm.reset({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate ? goal.targetDate.substring(0, 10) : ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openAddMoneyModal(goal: any) {
    this.selectedGoal = goal;
    this.addMoneyForm.reset({
      amount: '',
      type: 'MUTUAL_FUND'
    });
    this.showAddMoneyModal = true;
  }

  closeAddMoneyModal() {
    this.showAddMoneyModal = false;
    this.selectedGoal = null;
  }

  onSubmit() {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.goalForm.value;

    if (this.isDemoMode) {
      const target = parseFloat(formVal.targetAmount);
      const newG = {
        goalId: 'dg-' + Date.now(),
        goalName: formVal.goalName,
        targetAmount: target,
        currentAmount: 0,
        targetDate: formVal.targetDate,
        status: 'IN_PROGRESS'
      };
      this.goals.push(newG);
      this.recalculateTotals();
      this.formSubmitting = false;
      this.closeModal();
      return;
    }

    const payload = {
      ...formVal,
      userId: this.userId
    };

    if (this.editingGoalId) {
      this.goalService.updateGoal(this.editingGoalId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadGoals();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update savings goal.');
        }
      });
    } else {
      this.goalService.createGoal(payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadGoals();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to create savings goal.');
        }
      });
    }
  }

  onAddMoneySubmit() {
    if (this.addMoneyForm.invalid || !this.selectedGoal) return;

    this.formSubmitting = true;
    const formVal = this.addMoneyForm.value;
    const amount = parseFloat(formVal.amount);

    if (this.isDemoMode) {
      this.selectedGoal.currentAmount += amount;
      if (this.selectedGoal.currentAmount >= this.selectedGoal.targetAmount) {
        this.selectedGoal.status = 'ACHIEVED';
      }
      this.recalculateTotals();
      this.formSubmitting = false;
      this.closeAddMoneyModal();
      return;
    }

    const payload = {
      goalId: this.selectedGoal.goalId,
      userId: this.userId,
      amount: amount,
      type: formVal.type,
      currentValue: amount,
      startDate: new Date().toISOString().substring(0, 10),
      maturityDate: this.selectedGoal.targetDate || new Date().toISOString().substring(0, 10)
    };

    this.investmentService.createInvestment(payload).subscribe({
      next: () => {
        this.formSubmitting = false;
        this.closeAddMoneyModal();
        this.loadGoals();
      },
      error: (err) => {
        this.formSubmitting = false;
        alert(err?.error?.message || 'Failed to deposit money to goal.');
      }
    });
  }

  deleteGoal(id: string) {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      if (this.isDemoMode) {
        this.goals = this.goals.filter(g => g.goalId !== id);
        this.recalculateTotals();
        return;
      }
      this.goalService.deleteGoal(id).subscribe({
        next: () => this.loadGoals(),
        error: (err) => alert(err?.error?.message || 'Failed to delete goal.')
      });
    }
  }
}
