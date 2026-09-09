import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { InvestmentService } from '../../core/services/investment.service';
import { GoalService } from '../../core/services/goal.service';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Investment Portfolio</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Track and manage your asset allocations and security performance.</p>
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
            Record Investment
          </button>
        </div>
      </div>

      <!-- Financial Disclaimer Notice -->
      <div class="p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl text-xs leading-normal flex items-start gap-3">
        <span class="p-1 bg-white text-teal-600 rounded-lg shadow-sm border border-teal-200 font-bold text-[10px]">INFO</span>
        <div>
          <span class="font-bold">Educational Guidance Only:</span> All portfolio indicators, asset allocations, and security logs are for recording and educational purposes only.
        </div>
      </div>

      <!-- Investment Portfolio Metrics Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Capital Deployed
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Invested</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalInvested | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Current Portfolio Valuation
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Current Valuation</span>
          <h3 class="text-2xl font-black mt-1 text-emerald-700">₹{{ totalCurrentVal | number:'1.2-2' }}</h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Unrealized Gains
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Gains/Loss</span>
          <h3 class="text-2xl font-black mt-1" [class.text-emerald-600]="totalCurrentVal - totalInvested >= 0" [class.text-red-500]="totalCurrentVal - totalInvested < 0">
            {{ totalCurrentVal - totalInvested >= 0 ? '+' : '' }}₹{{ (totalCurrentVal - totalInvested) | number:'1.2-2' }}
          </h3>
        </div>

        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <div *ngIf="showGuide" class="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md mb-2 w-fit">
            📍 Absolute Growth %
          </div>
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Abs. Returns (%)</span>
          <h3 class="text-2xl font-black mt-1 text-emerald-600">
            +{{ getAbsoluteReturnsPct() | number:'1.2-2' }}%
          </h3>
        </div>
      </div>

      <!-- Main Columns -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Asset Allocation Column -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-4 relative">
            <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
              📍 Asset Allocation Breakdown: Diversification by security class
            </div>
            <h3 class="text-base font-bold">Asset Allocation</h3>
            
            <div class="space-y-3" *ngIf="investments.length > 0; else emptyAllocation">
              <div *ngFor="let item of getAllocationSummary()" class="space-y-1">
                <div class="flex justify-between text-xs font-semibold">
                  <span>{{ item.type?.replace('_', ' ') }}</span>
                  <span class="text-text-sub">₹{{ item.total | number:'1.0-0' }} ({{ item.percentage | number:'1.0-0' }}%)</span>
                </div>
                <div class="w-full bg-brand-bg rounded-full h-2">
                  <div class="bg-brand-primary h-2 rounded-full transition-all duration-500" [style.width.%]="item.percentage"></div>
                </div>
              </div>
            </div>

            <ng-template #emptyAllocation>
              <p class="text-xs text-text-sub py-4 text-center">No investments logged yet.</p>
            </ng-template>
          </div>
        </div>

        <!-- Active Holdings List Column -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm relative">
            <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
              📍 Active Securities: Real-time values, purchase capital, and individual gain/loss
            </div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold">Active Holdings</h3>
              <span class="text-xs text-text-sub font-semibold">{{ investments.length }} Assets</span>
            </div>

            <div class="space-y-3" *ngIf="investments.length > 0; else emptyHoldings">
              <div *ngFor="let inv of investments" class="p-4 border border-brand-border rounded-2xl flex justify-between items-center hover:bg-brand-bg transition-colors duration-150">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider">
                      {{ inv.type?.replace('_', ' ') }}
                    </span>
                    <span *ngIf="inv.goal" class="text-[10px] text-text-sub">Goal: {{ inv.goal.goalName }}</span>
                  </div>
                  <h4 class="font-bold text-sm text-text-main">{{ inv.notes || inv.type?.replace('_', ' ') }}</h4>
                  <p class="text-[11px] text-text-sub">Invested: ₹{{ inv.amount | number:'1.2-2' }} &middot; Maturity: {{ inv.maturityDate | date:'MMM yyyy' }}</p>
                </div>

                <div class="text-right space-y-1">
                  <span class="font-extrabold text-sm block">₹{{ inv.currentValue | number:'1.2-2' }}</span>
                  <span class="text-xs font-bold" [class.text-emerald-600]="inv.currentValue >= inv.amount" [class.text-red-500]="inv.currentValue < inv.amount">
                    {{ inv.currentValue >= inv.amount ? '+' : '' }}₹{{ (inv.currentValue - inv.amount) | number:'1.2-2' }}
                    ({{ ((inv.currentValue - inv.amount) / inv.amount * 100) | number:'1.1-1' }}%)
                  </span>
                  <div class="pt-1">
                    <button (click)="deleteInvestment(inv.investmentId)" class="text-[10px] text-red-500 hover:text-red-700 font-bold">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #emptyHoldings>
              <div class="text-center py-10 text-xs text-text-sub">
                No active investment records.
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Add Investment Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">Record Investment Asset</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              ✕
            </button>
          </div>

          <form [formGroup]="investmentForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Asset / Security Description</label>
              <input 
                type="text" 
                formControlName="notes" 
                placeholder="e.g. Nifty 50 ETF, HDFC Fixed Deposit"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Asset Class</label>
                <select 
                  formControlName="type"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="MUTUAL_FUND">Mutual Fund / SIP</option>
                  <option value="STOCKS">Equity / Stocks</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit (FD)</option>
                  <option value="RECURRING_DEPOSIT">Recurring Deposit</option>
                  <option value="GOLD">Sovereign Gold / Gold ETF</option>
                  <option value="REAL_ESTATE">Real Estate / REIT</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Link to Goal (Optional)</label>
                <select 
                  formControlName="goalId"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="">No Goal</option>
                  <option *ngFor="let g of goalsList" [value]="g.goalId">{{ g.goalName }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Invested Amount (₹)</label>
                <input 
                  type="number" 
                  formControlName="amount" 
                  placeholder="0.00"
                  class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
              </div>

              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Current Value (₹)</label>
                <input 
                  type="number" 
                  formControlName="currentValue" 
                  placeholder="0.00"
                  class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Start Date</label>
                <input 
                  type="date" 
                  formControlName="startDate"
                  class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
              </div>

              <div>
                <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Maturity Date</label>
                <input 
                  type="date" 
                  formControlName="maturityDate"
                  class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
              </div>
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
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class InvestmentsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private investmentService = inject(InvestmentService);
  private goalService = inject(GoalService);

  investments: any[] = [];
  goalsList: any[] = [];
  totalInvested = 155000;
  totalCurrentVal = 182400;

  loading = false;
  isDemoMode = true;
  showGuide = true;

  showModal = false;
  formSubmitting = false;
  userId = '';

  liveInvestments: any[] = [];
  liveTotalInvested = 0;
  liveTotalCurrentVal = 0;

  readonly demoInvestments = [
    {
      investmentId: 'inv-1',
      notes: 'Nifty 50 Index Mutual Fund (Direct Growth)',
      type: 'MUTUAL_FUND',
      amount: 50000.00,
      currentValue: 61200.00,
      startDate: '2025-01-10',
      maturityDate: '2030-01-10',
      goal: { goalName: 'Emergency Fund' }
    },
    {
      investmentId: 'inv-2',
      notes: 'Parag Parikh Flexi Cap Fund (SIP)',
      type: 'MUTUAL_FUND',
      amount: 40000.00,
      currentValue: 48500.00,
      startDate: '2025-03-15',
      maturityDate: '2029-03-15',
      goal: { goalName: 'MacBook Pro M3' }
    },
    {
      investmentId: 'inv-3',
      notes: 'HDFC Bank 3-Year Fixed Deposit (7.25% p.a.)',
      type: 'FIXED_DEPOSIT',
      amount: 35000.00,
      currentValue: 38200.00,
      startDate: '2024-08-20',
      maturityDate: '2027-08-20',
      goal: null
    },
    {
      investmentId: 'inv-4',
      notes: 'TCS & Infosys Bluechip Equity Stocks',
      type: 'STOCKS',
      amount: 30000.00,
      currentValue: 34500.00,
      startDate: '2025-06-01',
      maturityDate: '2032-06-01',
      goal: null
    }
  ];

  investmentForm: FormGroup = this.fb.group({
    notes: ['', [Validators.required]],
    type: ['MUTUAL_FUND', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(1)]],
    currentValue: ['', [Validators.required, Validators.min(0)]],
    startDate: [new Date().toISOString().substring(0, 10)],
    maturityDate: [''],
    goalId: ['']
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadInvestments();
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
    this.investments = [...this.demoInvestments];
    this.totalInvested = 155000;
    this.totalCurrentVal = 182400;
    this.loading = false;
  }

  private applyLiveData() {
    this.investments = [...this.liveInvestments];
    this.totalInvested = this.liveTotalInvested;
    this.totalCurrentVal = this.liveTotalCurrentVal;
    this.loading = false;
  }

  loadInvestments() {
    this.investmentService.getInvestments(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveInvestments = res.data;
          this.liveTotalInvested = 0;
          this.liveTotalCurrentVal = 0;
          this.liveInvestments.forEach(inv => {
            this.liveTotalInvested += inv.amount || 0;
            this.liveTotalCurrentVal += inv.currentValue || 0;
          });
          if (!this.isDemoMode) {
            this.applyLiveData();
          }
        }
      },
      error: (err) => console.warn('Could not load live investments', err)
    });
  }

  loadGoals() {
    this.goalService.getGoals(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) this.goalsList = res.data;
      }
    });
  }

  getAbsoluteReturnsPct(): number {
    if (this.totalInvested === 0) return 0;
    return ((this.totalCurrentVal - this.totalInvested) / this.totalInvested) * 100;
  }

  getAllocationSummary(): { type: string; total: number; percentage: number }[] {
    const map = new Map<string, number>();
    this.investments.forEach(i => {
      const current = map.get(i.type) || 0;
      map.set(i.type, current + (i.currentValue || i.amount || 0));
    });

    const totalVal = this.totalCurrentVal || 1;
    const list: any[] = [];
    map.forEach((val, key) => {
      list.push({
        type: key,
        total: val,
        percentage: (val / totalVal) * 100
      });
    });
    return list;
  }

  openAddModal() {
    this.investmentForm.reset({
      notes: '',
      type: 'MUTUAL_FUND',
      amount: '',
      currentValue: '',
      startDate: new Date().toISOString().substring(0, 10),
      maturityDate: new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
      goalId: ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.investmentForm.invalid) return;

    this.formSubmitting = true;
    const formVal = this.investmentForm.value;

    if (this.isDemoMode) {
      const newInv = {
        investmentId: 'demo-inv-' + Date.now(),
        notes: formVal.notes,
        type: formVal.type,
        amount: parseFloat(formVal.amount),
        currentValue: parseFloat(formVal.currentValue),
        startDate: formVal.startDate,
        maturityDate: formVal.maturityDate,
        goal: formVal.goalId ? this.goalsList.find(g => g.goalId === formVal.goalId) : null
      };
      this.investments.push(newInv);
      this.totalInvested += newInv.amount;
      this.totalCurrentVal += newInv.currentValue;
      this.formSubmitting = false;
      this.closeModal();
      return;
    }

    const payload = {
      ...formVal,
      userId: this.userId
    };

    this.investmentService.createInvestment(payload).subscribe({
      next: () => {
        this.formSubmitting = false;
        this.closeModal();
        this.loadInvestments();
      },
      error: (err) => {
        this.formSubmitting = false;
        alert(err?.error?.message || 'Failed to record investment.');
      }
    });
  }

  deleteInvestment(id: string) {
    if (confirm('Are you sure you want to remove this investment asset?')) {
      if (this.isDemoMode) {
        const item = this.investments.find(i => i.investmentId === id);
        if (item) {
          this.totalInvested -= item.amount;
          this.totalCurrentVal -= item.currentValue;
        }
        this.investments = this.investments.filter(i => i.investmentId !== id);
        return;
      }
      this.investmentService.deleteInvestment(id).subscribe({
        next: () => this.loadInvestments(),
        error: (err) => alert(err?.error?.message || 'Failed to delete investment.')
      });
    }
  }
}
