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
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Investment Portfolio</h1>
          <p class="text-text-sub text-sm mt-1">Track and manage your asset allocations and security performance.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Record Investment
        </button>
      </div>

      <!-- Financial Disclaimer Notice -->
      <div class="p-4 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl text-xs leading-normal flex items-start gap-3">
        <span class="p-1 bg-white text-teal-600 rounded-lg shadow-sm border border-teal-200 font-bold">INFO</span>
        <div>
          <span class="font-bold">Educational Guidance Only:</span> All portfolio indicators, asset allocations, and security logs are for recording and educational purposes only. This does not constitute professional financial, investment, or tax advice.
        </div>
      </div>

      <!-- Investment Portfolio Metrics Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Invested</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalInvested | number:'1.2-2' }}</h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Current Valuation</span>
          <h3 class="text-2xl font-black mt-1">₹{{ totalCurrentVal | number:'1.2-2' }}</h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Total Gains/Loss</span>
          <h3 class="text-2xl font-black mt-1" [class.text-green-600]="totalCurrentVal - totalInvested >= 0" [class.text-red-500]="totalCurrentVal - totalInvested < 0">
            ₹{{ (totalCurrentVal - totalInvested) | number:'1.2-2' }}
          </h3>
        </div>
        <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
          <span class="text-[10px] font-bold text-text-sub uppercase tracking-wider">Abs. Returns (%)</span>
          <h3 class="text-2xl font-black mt-1" [class.text-green-600]="totalCurrentVal - totalInvested >= 0" [class.text-red-500]="totalCurrentVal - totalInvested < 0">
            {{ getAbsoluteReturnsPct() | number:'1.2-2' }}%
          </h3>
        </div>
      </div>

      <!-- Main Columns -->
      <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Asset Allocation & Allocation Bar -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 class="text-base font-bold">Asset Allocation</h3>
            
            <div class="space-y-3" *ngIf="investments.length > 0; else emptyAllocation">
              <div *ngFor="let asset of assetAllocations" class="space-y-1">
                <div class="flex justify-between text-xs font-bold">
                  <span class="text-text-main">{{ asset.typeDisplay }}</span>
                  <span class="text-text-sub">{{ asset.percentage | number:'1.1-1' }}% (₹{{ asset.amount | number:'1.0-0' }})</span>
                </div>
                <div class="w-full bg-brand-bg rounded-full h-2">
                  <div 
                    [class]="getAssetProgressClass(asset.type)" 
                    class="h-2 rounded-full transition-all duration-300"
                    [style.width.%]="asset.percentage"
                  ></div>
                </div>
              </div>
            </div>

            <ng-template #emptyAllocation>
              <div class="text-center py-6 text-xs text-text-sub">
                Record your first investment to see asset allocations.
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Investments List Table -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
            <div class="p-5 border-b border-brand-border">
              <h3 class="text-base font-bold">Logged Holdings</h3>
              <p class="text-xs text-text-sub">Individual investment items recorded</p>
            </div>

            <!-- Loader -->
            <div *ngIf="loading" class="p-8 text-center text-xs text-text-sub">
              Loading portfolio details...
            </div>

            <!-- Empty holdings -->
            <div *ngIf="!loading && investments.length === 0" class="p-12 text-center text-xs text-text-sub">
              No holdings found. Click "Record Investment" above.
            </div>

            <!-- Holdings table -->
            <div class="overflow-x-auto" *ngIf="!loading && investments.length > 0">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-brand-bg border-b border-brand-border text-[10px] font-bold text-text-sub uppercase tracking-wider">
                    <th class="p-4">Asset Type</th>
                    <th class="p-4">Amount Invested</th>
                    <th class="p-4">Current Value</th>
                    <th class="p-4">Linked Savings Goal</th>
                    <th class="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-border text-sm">
                  <tr *ngFor="let inv of investments" class="hover:bg-brand-bg transition-colors duration-150">
                    <td class="p-4 font-bold text-text-main capitalize">{{ getAssetTypeLabel(inv.type) }}</td>
                    <td class="p-4 text-text-sub">₹{{ inv.amount | number:'1.2-2' }}</td>
                    <td class="p-4 font-semibold" [class.text-green-600]="inv.currentValue - inv.amount >= 0" [class.text-red-500]="inv.currentValue - inv.amount < 0">
                      ₹{{ inv.currentValue | number:'1.2-2' }}
                    </td>
                    <td class="p-4 text-text-sub text-xs">{{ inv.goal?.goalName || 'None (General)' }}</td>
                    <td class="p-4 text-center space-x-2">
                      <button (click)="openEditModal(inv)" class="text-xs text-brand-primary hover:text-brand-primary-dark font-bold">Edit</button>
                      <button (click)="deleteInvestment(inv.investmentId)" class="text-xs text-red-500 hover:text-red-700 font-bold">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Record Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingInvestmentId ? 'Edit Investment' : 'Record Investment' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="investmentForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Asset Type -->
            <div>
              <label for="type" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Asset Category</label>
              <select 
                id="type"
                formControlName="type"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="MUTUAL_FUND">Mutual Fund (SIP)</option>
                <option value="STOCK">Equity Shares (Stock)</option>
                <option value="BOND">Bonds</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit (FD)</option>
                <option value="OTHER">Other Allocation</option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Principal Amount Invested (₹)</label>
              <input 
                id="amount" 
                type="number" 
                formControlName="amount" 
                placeholder="0"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('amount')" class="text-xs text-red-500 mt-1">Amount is required and must be positive</p>
            </div>

            <!-- Current Value -->
            <div>
              <label for="currentValue" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Current Value Valuation (₹)</label>
              <input 
                id="currentValue" 
                type="number" 
                formControlName="currentValue" 
                placeholder="0"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('currentValue')" class="text-xs text-red-500 mt-1">Current value must be positive</p>
            </div>

            <!-- Goal link -->
            <div>
              <label for="goalId" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Link to Savings Goal (Optional)</label>
              <select 
                id="goalId"
                formControlName="goalId"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="">None (General Investment)</option>
                <option *ngFor="let goal of goalsList" [value]="goal.goalId">{{ goal.goalName }}</option>
              </select>
            </div>

            <!-- Start Date -->
            <div>
              <label for="startDate" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Investment Start Date</label>
              <input 
                id="startDate" 
                type="date" 
                formControlName="startDate"
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
                {{ formSubmitting ? 'Saving...' : 'Save Holding' }}
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
  assetAllocations: any[] = [];
  
  loading = true;
  showModal = false;
  editingInvestmentId: string | null = null;
  formSubmitting = false;
  userId = '';

  // Metrics
  totalInvested = 0;
  totalCurrentVal = 0;

  investmentForm: FormGroup = this.fb.group({
    type: ['MUTUAL_FUND', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(1)]],
    currentValue: ['', [Validators.required, Validators.min(0)]],
    goalId: [''],
    startDate: ['', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadInvestments();
    }
  }

  loadInvestments() {
    this.loading = true;
    this.totalInvested = 0;
    this.totalCurrentVal = 0;
    this.assetAllocations = [];

    // Load goals
    this.goalService.getGoals(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.goalsList = res.data.filter((g: any) => g.status === 'IN_PROGRESS');
        }
      }
    });

    // Load investments
    this.investmentService.getInvestments(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.investments = res.data;
          this.investments.forEach(inv => {
            this.totalInvested += inv.amount || 0;
            this.totalCurrentVal += inv.currentValue || 0;
          });
          this.calculateAllocations();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading investments', err);
        this.loading = false;
      }
    });
  }

  calculateAllocations() {
    const map = new Map<string, number>();
    this.investments.forEach(inv => {
      const type = inv.type || 'OTHER';
      map.set(type, (map.get(type) || 0) + (inv.currentValue || 0));
    });

    const list: any[] = [];
    map.forEach((amount, type) => {
      list.push({
        type,
        typeDisplay: this.getAssetTypeLabel(type),
        amount,
        percentage: this.totalCurrentVal > 0 ? (amount / this.totalCurrentVal) * 100 : 0
      });
    });

    // Sort descending by percentage
    this.assetAllocations = list.sort((a, b) => b.percentage - a.percentage);
  }

  getAssetTypeLabel(type: string): string {
    switch (type) {
      case 'MUTUAL_FUND': return 'Mutual Fund (SIP)';
      case 'STOCK': return 'Stocks (Equity)';
      case 'BOND': return 'Bonds';
      case 'REAL_ESTATE': return 'Real Estate';
      case 'FIXED_DEPOSIT': return 'Fixed Deposit (FD)';
      default: return 'Other Allocation';
    }
  }

  getAssetProgressClass(type: string): string {
    switch (type) {
      case 'MUTUAL_FUND': return 'bg-brand-primary';
      case 'STOCK': return 'bg-purple-400';
      case 'BOND': return 'bg-blue-400';
      case 'REAL_ESTATE': return 'bg-amber-400';
      default: return 'bg-teal-400';
    }
  }

  getAbsoluteReturnsPct(): number {
    if (this.totalInvested <= 0) return 0;
    return ((this.totalCurrentVal - this.totalInvested) / this.totalInvested) * 100;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.investmentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openAddModal() {
    this.editingInvestmentId = null;
    this.investmentForm.reset({
      type: 'MUTUAL_FUND',
      amount: '',
      currentValue: '',
      goalId: '',
      startDate: new Date().toISOString().substring(0, 10)
    });
    this.showModal = true;
  }

  openEditModal(holding: any) {
    this.editingInvestmentId = holding.investmentId;
    this.investmentForm.reset({
      type: holding.type,
      amount: holding.amount,
      currentValue: holding.currentValue,
      goalId: holding.goal?.goalId || '',
      startDate: holding.startDate ? holding.startDate.substring(0, 10) : ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.investmentForm.invalid) {
      this.investmentForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.investmentForm.value;
    const payload = {
      ...formVal,
      userId: this.userId,
      goalId: formVal.goalId ? formVal.goalId : null
    };

    if (this.editingInvestmentId) {
      this.investmentService.updateInvestment(this.editingInvestmentId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadInvestments();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update investment details.');
        }
      });
    } else {
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
  }

  deleteInvestment(id: string) {
    if (confirm('Are you sure you want to delete this holding record?')) {
      this.investmentService.deleteInvestment(id).subscribe({
        next: () => {
          this.loadInvestments();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete holding record.');
        }
      });
    }
  }
}
