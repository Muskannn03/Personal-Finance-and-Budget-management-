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
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">My Wallets</h1>
          <p class="text-text-sub text-sm mt-1">Manage cash, bank accounts, and credit cards in one place.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Wallet
        </button>
      </div>

      <!-- Net Worth Banner Card -->
      <div class="p-6 bg-brand-primary-light border border-brand-primary rounded-2xl flex justify-between items-center">
        <div>
          <p class="text-xs font-bold text-brand-primary-dark uppercase tracking-wider">Estimated Net Worth</p>
          <h2 class="text-3xl font-black text-brand-primary-dark mt-1">₹{{ netWorth | number:'1.2-2' }}</h2>
        </div>
        <span class="p-3 bg-white text-brand-primary rounded-2xl shadow-sm border border-brand-border">
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

      <div *ngIf="!loading && accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let acc of accounts" 
          [class]="getAccountColorClasses(acc.accountType)"
          class="p-6 border rounded-2xl flex flex-col justify-between h-44 shadow-sm hover:shadow transition-shadow duration-200"
        >
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider opacity-75">{{ acc.accountType }}</span>
              <h3 class="text-lg font-bold text-text-main mt-0.5">{{ acc.accountName }}</h3>
            </div>
            <span class="text-xs font-bold text-text-sub capitalize">
              {{ acc.accountType === 'CREDIT_CARD' ? 'Credit Card' : 'Asset' }}
            </span>
          </div>

          <div class="mt-4 flex justify-between items-end">
            <div>
              <p class="text-[10px] font-bold text-text-sub uppercase tracking-wider opacity-75">
                {{ acc.accountType === 'CREDIT_CARD' ? 'Current Owed' : 'Balance' }}
              </p>
              <h2 class="text-2xl font-black text-text-main mt-0.5">₹{{ acc.balance | number:'1.2-2' }}</h2>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="openEditModal(acc)"
                class="px-2.5 py-1.5 bg-white/70 hover:bg-white border border-brand-border rounded-xl text-xs font-bold text-text-main"
              >
                Edit
              </button>
              <button 
                (click)="deleteAccount(acc.accountId)"
                class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingAccountId ? 'Edit Wallet' : 'Add New Wallet' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Account Name -->
            <div>
              <label for="accountName" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Wallet Name / Account Name</label>
              <input 
                id="accountName" 
                type="text" 
                formControlName="accountName" 
                placeholder="e.g. HDFC Savings, Cash In Hand"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('accountName')" class="text-xs text-red-500 mt-1">Wallet name must be at least 2 characters</p>
            </div>

            <!-- Account Type -->
            <div>
              <label for="accountType" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Wallet Type</label>
              <select 
                id="accountType"
                formControlName="accountType"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="" disabled>Select Type</option>
                <option value="SAVINGS">Savings Account</option>
                <option value="CHECKING">Checking Account</option>
                <option value="CASH">Cash (Physical Wallet)</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="INVESTMENT">Investment Demat Account</option>
              </select>
              <p *ngIf="isFieldInvalid('accountType')" class="text-xs text-red-500 mt-1">Wallet type is required</p>
            </div>

            <!-- Initial Balance -->
            <div>
              <label for="balance" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Current Balance / Limit Owed (₹)</label>
              <input 
                id="balance" 
                type="number" 
                formControlName="balance" 
                placeholder="0.00"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('balance')" class="text-xs text-red-500 mt-1">A valid number is required</p>
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
  netWorth = 0;
  loading = true;
  showModal = false;
  editingAccountId: string | null = null;
  formSubmitting = false;
  userId = '';

  accountForm: FormGroup = this.fb.group({
    accountName: ['', [Validators.required, Validators.minLength(2)]],
    accountType: ['', [Validators.required]],
    balance: [0, [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadAccounts();
    }
  }

  loadAccounts() {
    this.loading = true;
    this.accountService.getAccounts(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.accounts = res.data;
        }
        
        // Fetch Net Worth
        this.accountService.getNetWorth(this.userId).subscribe({
          next: (nwRes: any) => {
            this.netWorth = nwRes?.data || 0;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading accounts', err);
        this.loading = false;
      }
    });
  }

  getAccountColorClasses(type: string): string {
    switch (type) {
      case 'SAVINGS':
        return 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50';
      case 'INVESTMENT':
        return 'bg-purple-50/50 border-purple-100 hover:bg-purple-50';
      case 'CHECKING':
        return 'bg-blue-50/50 border-blue-100 hover:bg-blue-50';
      case 'CREDIT_CARD':
        return 'bg-orange-50/50 border-orange-100 hover:bg-orange-50';
      default:
        return 'bg-yellow-50/50 border-yellow-100 hover:bg-yellow-50';
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
      balance: 0
    });
    this.showModal = true;
  }

  openEditModal(account: any) {
    this.editingAccountId = account.accountId;
    this.accountForm.reset({
      accountName: account.accountName,
      accountType: account.accountType,
      balance: account.balance
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
    const payload = {
      ...this.accountForm.value,
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
          alert(err?.error?.message || 'Failed to update account.');
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
          alert(err?.error?.message || 'Failed to create account.');
        }
      });
    }
  }

  deleteAccount(id: string) {
    if (confirm('Are you sure you want to delete this account? This will delete all associated transactions.')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete account.');
        }
      });
    }
  }
}
