import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AccountService } from '../../core/services/account.service';
import { BudgetService } from '../../core/services/budget.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Transactions</h1>
          <p class="text-text-sub text-sm mt-1">Track every rupee coming in and going out.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      <!-- Filters Panel Card -->
      <div class="bg-white border border-brand-border p-5 rounded-2xl shadow-sm space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Account filter -->
          <div>
            <label class="block text-[10px] font-bold text-text-sub uppercase tracking-wider mb-1">Account</label>
            <select 
              [(ngModel)]="filterAccountId" 
              (change)="applyFilters()" 
              class="w-full px-3 py-2 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
            >
              <option value="">All Accounts</option>
              <option *ngFor="let acc of accountsList" [value]="acc.accountId">{{ acc.accountName }}</option>
            </select>
          </div>

          <!-- Transaction Type filter -->
          <div>
            <label class="block text-[10px] font-bold text-text-sub uppercase tracking-wider mb-1">Type</label>
            <select 
              [(ngModel)]="filterType" 
              (change)="applyFilters()" 
              class="w-full px-3 py-2 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income (Money In)</option>
              <option value="EXPENSE">Expense (Money Out)</option>
            </select>
          </div>

          <!-- Date Filters -->
          <div>
            <label class="block text-[10px] font-bold text-text-sub uppercase tracking-wider mb-1">Start Date</label>
            <input 
              type="date" 
              [(ngModel)]="filterStartDate" 
              (change)="applyFilters()" 
              class="w-full px-3 py-2 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
            >
          </div>
          <div>
            <label class="block text-[10px] font-bold text-text-sub uppercase tracking-wider mb-1">End Date</label>
            <input 
              type="date" 
              [(ngModel)]="filterEndDate" 
              (change)="applyFilters()" 
              class="w-full px-3 py-2 border border-brand-border rounded-xl bg-brand-bg text-xs focus:outline-none focus:border-brand-primary"
            >
          </div>
        </div>

        <div class="flex justify-end">
          <button (click)="resetFilters()" class="text-xs font-bold text-text-sub hover:text-brand-primary-dark">
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Main Transactions View -->
      <div class="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <!-- Loader -->
        <div *ngIf="loading" class="p-12 text-center text-text-sub text-sm">
          Loading transactions...
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && transactions.length === 0" class="p-12 text-center space-y-3">
          <p class="text-sm text-text-sub">No transactions matching your criteria were found.</p>
          <button (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Record your first transaction</button>
        </div>

        <!-- Transactions Table (Desktop) -->
        <div class="hidden md:block overflow-x-auto" *ngIf="!loading && transactions.length > 0">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-brand-bg border-b border-brand-border text-[10px] font-bold text-text-sub uppercase tracking-wider">
                <th class="p-4">Description</th>
                <th class="p-4">Category</th>
                <th class="p-4">Account</th>
                <th class="p-4">Date</th>
                <th class="p-4 text-right">Amount</th>
                <th class="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border text-sm">
              <tr *ngFor="let t of transactions" class="hover:bg-brand-bg transition-colors duration-150">
                <td class="p-4 font-bold text-text-main">{{ t.description || 'Transaction' }}</td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                        [class.bg-emerald-50]="t.type === 'INCOME'" [class.text-emerald-700]="t.type === 'INCOME'"
                        [class.bg-orange-50]="t.type === 'EXPENSE'" [class.text-orange-600]="t.type === 'EXPENSE'">
                    {{ t.category?.categoryName || 'General' }}
                  </span>
                </td>
                <td class="p-4 text-text-sub">{{ t.account?.accountName || 'Cash' }}</td>
                <td class="p-4 text-text-sub text-xs">{{ t.date | date:'MMM d, yyyy h:mm a' }}</td>
                <td class="p-4 text-right font-extrabold" [class.text-emerald-600]="t.type === 'INCOME'" [class.text-orange-600]="t.type === 'EXPENSE'">
                  {{ t.type === 'INCOME' ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
                </td>
                <td class="p-4 text-center space-x-2">
                  <button (click)="openEditModal(t)" class="text-xs text-brand-primary hover:text-brand-primary-dark font-bold">Edit</button>
                  <button (click)="deleteTransaction(t.transactionId)" class="text-xs text-red-500 hover:text-red-700 font-bold">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Stacked list (Mobile) -->
        <div class="md:hidden divide-y divide-brand-border" *ngIf="!loading && transactions.length > 0">
          <div *ngFor="let t of transactions" class="p-4 space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-sm">{{ t.description || 'Transaction' }}</h4>
                <p class="text-xs text-text-sub">{{ t.date | date:'MMM d, yyyy' }}</p>
              </div>
              <span class="font-extrabold text-sm" [class.text-emerald-600]="t.type === 'INCOME'" [class.text-orange-600]="t.type === 'EXPENSE'">
                {{ t.type === 'INCOME' ? '+' : '-' }}₹{{ t.amount | number:'1.2-2' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="px-2 py-0.5 rounded-full bg-brand-bg border border-brand-border text-text-sub">
                {{ t.category?.categoryName || 'General' }}
              </span>
              <span class="text-text-sub">{{ t.account?.accountName }}</span>
            </div>
            <div class="flex justify-end gap-3 pt-2 text-xs">
              <button (click)="openEditModal(t)" class="text-brand-primary font-bold">Edit</button>
              <button (click)="deleteTransaction(t.transactionId)" class="text-red-500 font-bold">Delete</button>
            </div>
          </div>
        </div>

        <!-- Pagination Footer -->
        <div class="p-4 border-t border-brand-border flex justify-between items-center text-xs" *ngIf="!loading && transactions.length > 0">
          <button 
            [disabled]="currentPage === 0" 
            (click)="goToPage(currentPage - 1)" 
            class="px-3 py-1.5 border border-brand-border rounded-xl disabled:opacity-50 text-text-sub"
          >
            Previous
          </button>
          <span class="font-semibold text-text-sub">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button 
            [disabled]="currentPage + 1 >= totalPages" 
            (click)="goToPage(currentPage + 1)" 
            class="px-3 py-1.5 border border-brand-border rounded-xl disabled:opacity-50 text-text-sub"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingTransactionId ? 'Edit Transaction' : 'Record Transaction' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Type Selector -->
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Transaction Type</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  (click)="setTransactionType('INCOME')"
                  [class.bg-emerald-50]="transactionForm.value.type === 'INCOME'"
                  [class.border-emerald-500]="transactionForm.value.type === 'INCOME'"
                  [class.text-emerald-700]="transactionForm.value.type === 'INCOME'"
                  class="py-2.5 border border-brand-border rounded-xl text-xs font-bold text-center transition-all focus:outline-none bg-white text-text-sub"
                >
                  🟢 Income (Money In)
                </button>
                <button 
                  type="button" 
                  (click)="setTransactionType('EXPENSE')"
                  [class.bg-orange-50]="transactionForm.value.type === 'EXPENSE'"
                  [class.border-orange-500]="transactionForm.value.type === 'EXPENSE'"
                  [class.text-orange-700]="transactionForm.value.type === 'EXPENSE'"
                  class="py-2.5 border border-brand-border rounded-xl text-xs font-bold text-center transition-all focus:outline-none bg-white text-text-sub"
                >
                  🔴 Expense (Money Out)
                </button>
              </div>
            </div>

            <!-- Amount Input -->
            <div>
              <label for="amount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Amount (₹)</label>
              <input 
                id="amount" 
                type="number" 
                formControlName="amount" 
                placeholder="0.00"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('amount')" class="text-xs text-red-500 mt-1">Amount is required and must be positive</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Description / Merchant</label>
              <input 
                id="description" 
                type="text" 
                formControlName="description" 
                placeholder="e.g. Swiggy, Salary, Rent"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('description')" class="text-xs text-red-500 mt-1">Description is required</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Account Selector -->
              <div>
                <label for="accountId" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Wallet / Account</label>
                <select 
                  id="accountId"
                  formControlName="accountId"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="" disabled>Select Account</option>
                  <option *ngFor="let acc of accountsList" [value]="acc.accountId">{{ acc.accountName }}</option>
                </select>
                <p *ngIf="isFieldInvalid('accountId')" class="text-xs text-red-500 mt-1">Account is required</p>
              </div>

              <!-- Category Selector -->
              <div>
                <label for="categoryId" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Category</label>
                <select 
                  id="categoryId"
                  formControlName="categoryId"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="" disabled>Select Category</option>
                  <option *ngFor="let cat of categoriesList" [value]="cat.categoryId">{{ cat.categoryName }} ({{ cat.type }})</option>
                </select>
                <p *ngIf="isFieldInvalid('categoryId')" class="text-xs text-red-500 mt-1">Category is required</p>
              </div>
            </div>

            <!-- Date -->
            <div>
              <label for="date" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Date</label>
              <input 
                id="date" 
                type="datetime-local" 
                formControlName="date"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
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
                {{ formSubmitting ? 'Saving...' : 'Save Record' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private budgetService = inject(BudgetService);

  transactions: any[] = [];
  accountsList: any[] = [];
  categoriesList: any[] = [];
  
  loading = true;
  showModal = false;
  editingTransactionId: string | null = null;
  formSubmitting = false;
  userId = '';

  // Pagination
  currentPage = 0;
  totalPages = 1;
  pageSize = 10;

  // Filters Model
  filterAccountId = '';
  filterType = '';
  filterStartDate = '';
  filterEndDate = '';

  transactionForm: FormGroup = this.fb.group({
    type: ['EXPENSE', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    accountId: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    date: ['']
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadSupportData();
      this.loadTransactions();
    }
  }

  loadSupportData() {
    this.accountService.getAccounts(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.accountsList = res.data;
        }
      }
    });

    this.budgetService.getCategories(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.categoriesList = res.data;
        }
      }
    });
  }

  loadTransactions() {
    this.loading = true;
    
    const params: any = {
      userId: this.userId,
      page: this.currentPage,
      size: this.pageSize,
      sort: 'date,desc'
    };

    if (this.filterAccountId) params.accountId = this.filterAccountId;
    if (this.filterType) params.type = this.filterType;
    if (this.filterStartDate) params.startDate = new Date(this.filterStartDate).toISOString();
    if (this.filterEndDate) params.endDate = new Date(this.filterEndDate).toISOString();

    this.transactionService.getTransactions(params).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.transactions = res.data.content || [];
          this.totalPages = res.data.totalPages || 1;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadTransactions();
  }

  resetFilters() {
    this.filterAccountId = '';
    this.filterType = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.currentPage = 0;
    this.loadTransactions();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  setTransactionType(type: string) {
    this.transactionForm.patchValue({ type });
  }

  openAddModal() {
    this.editingTransactionId = null;
    this.transactionForm.reset({
      type: 'EXPENSE',
      amount: '',
      description: '',
      accountId: this.accountsList.length > 0 ? this.accountsList[0].accountId : '',
      categoryId: this.categoriesList.length > 0 ? this.categoriesList[0].categoryId : '',
      date: new Date().toISOString().substring(0, 16)
    });
    this.showModal = true;
  }

  openEditModal(transaction: any) {
    this.editingTransactionId = transaction.transactionId;
    this.transactionForm.reset({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      accountId: transaction.account?.accountId || '',
      categoryId: transaction.category?.categoryId || '',
      date: transaction.date ? transaction.date.substring(0, 16) : ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.transactionForm.value;
    
    // Parse date if empty
    if (!formVal.date) {
      formVal.date = new Date().toISOString();
    } else {
      formVal.date = new Date(formVal.date).toISOString();
    }

    const payload = {
      ...formVal,
      userId: this.userId
    };

    if (this.editingTransactionId) {
      this.transactionService.updateTransaction(this.editingTransactionId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadTransactions();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update transaction.');
        }
      });
    } else {
      this.transactionService.createTransaction(payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadTransactions();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to create transaction.');
        }
      });
    }
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction record?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete transaction.');
        }
      });
    }
  }
}
