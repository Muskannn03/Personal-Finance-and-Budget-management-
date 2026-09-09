import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">My Wallets</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Manage cash, bank accounts, and credit cards in one place.</p>
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
            Add Wallet
          </button>
        </div>
      </div>

      <!-- Net Worth Banner Card -->
      <div class="p-6 bg-brand-primary-light border border-brand-primary rounded-2xl flex justify-between items-center relative overflow-hidden shadow-sm">
        <div *ngIf="showGuide" class="absolute top-2 right-4 text-[10px] font-bold text-brand-primary-dark bg-white px-2.5 py-0.5 rounded-full border border-brand-border">
          📍 Net Worth Calculation: Total Assets minus Liabilities (Credit Cards)
        </div>
        <div>
          <p class="text-xs font-bold text-brand-primary-dark uppercase tracking-wider">Estimated Net Worth</p>
          <h2 class="text-3xl font-black text-brand-primary-dark mt-1">₹{{ netWorth | number:'1.2-2' }}</h2>
          <p class="text-[11px] text-brand-primary-dark/80 mt-0.5 font-medium">Consolidated across {{ accounts.length }} active accounts & credit cards</p>
        </div>
        <span class="p-3.5 bg-white text-brand-primary rounded-2xl shadow-sm border border-brand-border">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </span>
      </div>

      <!-- Accounts Grid -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div class="h-40 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2, 3]"></div>
      </div>

      <div *ngIf="!loading && accounts.length === 0" class="bg-white border border-brand-border p-12 rounded-2xl text-center shadow-sm space-y-3">
        <p class="text-sm text-text-sub">No wallets or bank accounts have been added yet.</p>
        <button (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Create a new wallet</button>
      </div>

      <div *ngIf="!loading && accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          *ngFor="let acc of accounts" 
          [class]="getAccountColorClasses(acc.accountType)"
          class="p-6 border rounded-2xl flex flex-col justify-between shadow-sm hover:shadow transition-shadow duration-200 relative"
        >
          <div *ngIf="showGuide" class="mb-2 text-[10px] font-bold text-text-sub bg-white/90 px-2 py-0.5 rounded w-fit border border-brand-border">
            📍 {{ acc.accountType?.replace('_', ' ') }} Wallet
          </div>

          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-75">{{ acc.accountType }}</span>
              <h3 class="text-base font-bold text-text-main mt-0.5 leading-tight">{{ acc.accountName }}</h3>
            </div>
            <span class="text-[11px] font-bold text-text-sub capitalize">
              {{ acc.accountType === 'CREDIT_CARD' ? 'Liability' : 'Asset' }}
            </span>
          </div>

          <div class="mt-4 flex justify-between items-end">
            <div>
              <p class="text-[10px] font-bold text-text-sub uppercase tracking-wider opacity-75">
                {{ acc.accountType === 'CREDIT_CARD' ? 'Current Owed' : 'Available Balance' }}
              </p>
              <h2 class="text-2xl font-black mt-0.5" [class.text-orange-600]="acc.balance < 0" [class.text-text-main]="acc.balance >= 0">
                ₹{{ acc.balance | number:'1.2-2' }}
              </h2>
            </div>
            <div class="flex gap-1.5">
              <button 
                (click)="openEditModal(acc)"
                class="px-2.5 py-1.5 bg-white/80 hover:bg-white border border-brand-border rounded-xl text-xs font-bold text-text-main shadow-2xs"
              >
                Edit
              </button>
              <button 
                (click)="deleteAccount(acc.accountId)"
                class="px-2.5 py-1.5 bg-white/80 hover:bg-red-50 border border-brand-border rounded-xl text-xs font-bold text-red-500 shadow-2xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingAccountId ? 'Edit Wallet' : 'Add Wallet / Account' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Account Name -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Wallet / Account Name</label>
              <input 
                type="text" 
                formControlName="accountName" 
                placeholder="e.g. HDFC Salary Account, ICICI Card"
                class="w-full px-4 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-sm focus:outline-none focus:border-brand-primary"
                [class.border-red-400]="isFieldInvalid('accountName')"
              >
            </div>

            <!-- Account Type -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Account Type</label>
              <select 
                formControlName="accountType"
                class="w-full px-3 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
              >
                <option value="SAVINGS">Savings Account</option>
                <option value="CHECKING">Checking / Current Account</option>
                <option value="CREDIT_CARD">Credit Card (Liability)</option>
                <option value="INVESTMENT">Investment Account / Demat</option>
                <option value="CASH">Physical Cash Wallet</option>
              </select>
            </div>

            <!-- Initial Balance -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Initial Balance (₹)</label>
              <input 
                type="number" 
                step="0.01" 
                formControlName="balance" 
                placeholder="0.00"
                class="w-full px-4 py-2.5 border border-brand-border rounded-xl bg-brand-bg text-sm focus:outline-none focus:border-brand-primary"
                [class.border-red-400]="isFieldInvalid('balance')"
              >
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
                {{ formSubmitting ? 'Saving...' : 'Save Wallet' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AccountsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);

  accounts: any[] = [];
  netWorth = 142850;
  loading = false;
  isDemoMode = true;
  showGuide = true;

  showModal = false;
  editingAccountId: string | null = null;
  formSubmitting = false;
  userId = '';

  // Cached live data
  liveAccounts: any[] = [];
  liveNetWorth = 0;

  readonly demoAccounts = [
    { accountId: 'w-1', accountName: 'HDFC Salary Account', accountType: 'SAVINGS', balance: 82450.00 },
    { accountId: 'w-2', accountName: 'ICICI Coral Platinum Card', accountType: 'CREDIT_CARD', balance: -11400.00 },
    { accountId: 'w-3', accountName: 'Groww Mutual Funds & SIP', accountType: 'INVESTMENT', balance: 65500.00 },
    { accountId: 'w-4', accountName: 'Physical Cash & Wallet', accountType: 'CASH', balance: 6300.00 }
  ];

  accountForm: FormGroup = this.fb.group({
    accountName: ['', [Validators.required]],
    accountType: ['SAVINGS', [Validators.required]],
    balance: [0, [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadAccounts();
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
    this.accounts = [...this.demoAccounts];
    this.calculateNetWorth();
    this.loading = false;
  }

  private applyLiveData() {
    this.accounts = [...this.liveAccounts];
    this.netWorth = this.liveNetWorth;
    this.loading = false;
  }

  loadAccounts() {
    this.accountService.getAccounts(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveAccounts = res.data;
          this.liveNetWorth = 0;
          this.liveAccounts.forEach(acc => {
            if (acc.accountType === 'CREDIT_CARD') {
              this.liveNetWorth -= Math.abs(acc.balance || 0);
            } else {
              this.liveNetWorth += acc.balance || 0;
            }
          });
          if (!this.isDemoMode) {
            this.applyLiveData();
          }
        }
      },
      error: (err) => console.warn('Could not load live accounts', err)
    });
  }

  calculateNetWorth() {
    this.netWorth = 0;
    this.accounts.forEach(acc => {
      if (acc.accountType === 'CREDIT_CARD') {
        this.netWorth -= Math.abs(acc.balance || 0);
      } else {
        this.netWorth += acc.balance || 0;
      }
    });
  }

  getAccountColorClasses(type: string): string {
    switch (type) {
      case 'SAVINGS':
        return 'bg-brand-bg border-brand-border';
      case 'INVESTMENT':
        return 'bg-purple-50/50 border-purple-200';
      case 'CHECKING':
        return 'bg-emerald-50/50 border-emerald-200';
      case 'CREDIT_CARD':
        return 'bg-orange-50/50 border-orange-200';
      case 'CASH':
        return 'bg-yellow-50/50 border-yellow-200';
      default:
        return 'bg-white border-brand-border';
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.accountForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openAddModal() {
    this.editingAccountId = null;
    this.accountForm.reset({
      accountName: '',
      accountType: 'SAVINGS',
      balance: ''
    });
    this.showModal = true;
  }

  openEditModal(acc: any) {
    this.editingAccountId = acc.accountId;
    this.accountForm.reset({
      accountName: acc.accountName,
      accountType: acc.accountType,
      balance: acc.balance
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.accountForm.value;

    if (this.isDemoMode) {
      const newAcc = {
        accountId: 'demo-w-' + Date.now(),
        accountName: formVal.accountName,
        accountType: formVal.accountType,
        balance: parseFloat(formVal.balance || 0)
      };
      this.accounts.push(newAcc);
      this.calculateNetWorth();
      this.formSubmitting = false;
      this.closeModal();
      return;
    }

    const payload = {
      ...formVal,
      userId: this.userId
    };

    if (this.editingAccountId) {
      this.accountService.updateAccount(this.editingAccountId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadAccounts();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update wallet.');
        }
      });
    } else {
      this.accountService.createAccount(payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadAccounts();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to create wallet.');
        }
      });
    }
  }

  deleteAccount(id: string) {
    if (confirm('Are you sure you want to delete this wallet?')) {
      if (this.isDemoMode) {
        this.accounts = this.accounts.filter(a => a.accountId !== id);
        this.calculateNetWorth();
        return;
      }
      this.accountService.deleteAccount(id).subscribe({
        next: () => this.loadAccounts(),
        error: (err) => alert(err?.error?.message || 'Failed to delete wallet.')
      });
    }
  }
}
