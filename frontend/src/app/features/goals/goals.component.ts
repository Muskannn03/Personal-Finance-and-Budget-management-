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
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Savings Goals</h1>
          <p class="text-text-sub text-sm mt-1">Set milestones for things you want to purchase or save for.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Goal
        </button>
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
          class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between h-56 hover:shadow transition-shadow duration-200"
        >
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

            <div class="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden">
              <div 
                [class.bg-green-500]="goal.status === 'ACHIEVED'"
                [class.bg-brand-primary]="goal.status === 'IN_PROGRESS'"
                [class.bg-red-500]="goal.status === 'FAILED'"
                class="h-2.5 rounded-full transition-all duration-300"
                [style.width.%]="getProgressPercentage(goal)"
              ></div>
            </div>

            <div class="flex justify-between items-center text-[10px] font-bold mt-1">
              <span [class.text-green-600]="goal.status === 'ACHIEVED'"
                    [class.text-brand-primary-dark]="goal.status === 'IN_PROGRESS'"
                    [class.text-red-500]="goal.status === 'FAILED'">
                {{ goal.status === 'ACHIEVED' ? '🎉 Achieved!' : goal.status === 'FAILED' ? '❌ Failed' : '🕒 In Progress' }}
              </span>
              <span class="text-text-sub">{{ getProgressPercentage(goal) | number:'1.0-0' }}% Completed</span>
            </div>
          </div>

          <!-- Add Money trigger -->
          <div class="mt-4 pt-4 border-t border-brand-border flex justify-between items-center">
            <span class="text-xs text-text-sub">Linked Investments</span>
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
            <!-- Goal Name -->
            <div>
              <label for="goalName" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Goal Milestone Name</label>
              <input 
                id="goalName" 
                type="text" 
                formControlName="goalName" 
                placeholder="e.g. Buy a Laptop, Travel Fund"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('goalName')" class="text-xs text-red-500 mt-1">Goal name is required</p>
            </div>

            <!-- Target Amount -->
            <div>
              <label for="targetAmount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Target Amount (₹)</label>
              <input 
                id="targetAmount" 
                type="number" 
                formControlName="targetAmount" 
                placeholder="0"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('targetAmount')" class="text-xs text-red-500 mt-1">Target amount must be positive</p>
            </div>

            <!-- Target Date -->
            <div>
              <label for="targetDate" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Target Completion Date</label>
              <input 
                id="targetDate" 
                type="date" 
                formControlName="targetDate"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('targetDate')" class="text-xs text-red-500 mt-1">Target date is required</p>
            </div>

            <!-- Goal Status -->
            <div *ngIf="editingGoalId">
              <label for="status" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Goal Status</label>
              <select 
                id="status"
                formControlName="status"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ACHIEVED">Achieved</option>
                <option value="FAILED">Failed</option>
              </select>
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
                {{ formSubmitting ? 'Saving...' : 'Save Goal' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Money Modal (Overlay) -->
      <div *ngIf="showAddMoneyModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">Add Money to "{{ selectedGoal?.goalName }}"</h3>
            <button (click)="closeAddMoneyModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="addMoneyForm" (ngSubmit)="onSubmitAddMoney()" class="p-6 space-y-4">
            <p class="text-xs text-text-sub leading-normal">
              Adding money creates a new investment allocation linked to this goal. The database trigger will automatically increment your saved progress.
            </p>

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Amount to Add (₹)</label>
              <input 
                id="amount" 
                type="number" 
                formControlName="amount" 
                placeholder="0"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isAddMoneyFieldInvalid('amount')" class="text-xs text-red-500 mt-1">Amount must be positive</p>
            </div>

            <!-- Investment Type -->
            <div>
              <label for="type" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Allocation Source Type</label>
              <select 
                id="type"
                formControlName="type"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="MUTUAL_FUND">Mutual Fund (SIP)</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit (FD)</option>
                <option value="STOCK">Equity Shares (Stock)</option>
                <option value="BOND">Bonds</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="OTHER">Other Savings</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-brand-border">
              <button 
                type="button" 
                (click)="closeAddMoneyModal()" 
                class="px-4 py-2.5 border border-brand-border rounded-xl text-xs font-bold text-text-sub hover:bg-brand-bg focus:outline-none"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="formSubmitting"
                class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl focus:outline-none shadow-sm hover:shadow"
              >
                {{ formSubmitting ? 'Processing...' : 'Confirm Allocation' }}
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
  loading = true;
  showModal = false;
  showAddMoneyModal = false;
  editingGoalId: string | null = null;
  selectedGoal: any | null = null;
  formSubmitting = false;
  userId = '';

  goalForm: FormGroup = this.fb.group({
    goalName: ['', [Validators.required, Validators.minLength(2)]],
    targetAmount: ['', [Validators.required, Validators.min(1)]],
    targetDate: ['', [Validators.required]],
    status: ['IN_PROGRESS']
  });

  addMoneyForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    type: ['MUTUAL_FUND', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadGoals();
    }
  }

  loadGoals() {
    this.loading = true;
    this.goalService.getGoals(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.goals = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading goals', err);
        this.loading = false;
      }
    });
  }

  getProgressPercentage(goal: any): number {
    if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;
    return pct > 100 ? 100 : pct;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.goalForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isAddMoneyFieldInvalid(field: string): boolean {
    const control = this.addMoneyForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openAddModal() {
    this.editingGoalId = null;
    
    // Set target date default to 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const targetDateStr = nextYear.toISOString().substring(0, 10);

    this.goalForm.reset({
      goalName: '',
      targetAmount: '',
      targetDate: targetDateStr,
      status: 'IN_PROGRESS'
    });
    this.showModal = true;
  }

  openEditModal(goal: any) {
    this.editingGoalId = goal.goalId;
    this.goalForm.reset({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate ? goal.targetDate.substring(0, 10) : '',
      status: goal.status
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

  onSubmitAddMoney() {
    if (this.addMoneyForm.invalid || !this.selectedGoal) {
      this.addMoneyForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.addMoneyForm.value;

    const payload = {
      userId: this.userId,
      goalId: this.selectedGoal.goalId,
      type: formVal.type,
      amount: formVal.amount,
      startDate: new Date().toISOString().substring(0, 10),
      currentValue: formVal.amount
    };

    this.investmentService.createInvestment(payload).subscribe({
      next: () => {
        this.formSubmitting = false;
        this.closeAddMoneyModal();
        this.loadGoals();
      },
      error: (err) => {
        this.formSubmitting = false;
        alert(err?.error?.message || 'Failed to process money allocation.');
      }
    });
  }

  deleteGoal(id: string) {
    if (confirm('Are you sure you want to delete this savings goal? This will unlink associated investments.')) {
      this.goalService.deleteGoal(id).subscribe({
        next: () => {
          this.loadGoals();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete savings goal.');
        }
      });
    }
  }
}
