import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ReminderService } from '../../core/services/reminder.service';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Reminders</h1>
          <p class="text-text-sub text-sm mt-1">Never miss recurring bills, budget breaches or investment deposits.</p>
        </div>
        <button 
          (click)="openAddModal()" 
          class="px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Set Reminder
        </button>
      </div>

      <!-- Tabs navigation -->
      <div class="flex border-b border-brand-border gap-2">
        <button 
          (click)="currentTab = 'PENDING'"
          [class.border-brand-primary]="currentTab === 'PENDING'"
          [class.text-brand-primary-dark]="currentTab === 'PENDING'"
          class="pb-3 px-4 font-bold text-xs border-b-2 border-transparent transition-all focus:outline-none text-text-sub"
        >
          🔔 Active Reminders
        </button>
        <button 
          (click)="currentTab = 'COMPLETED'"
          [class.border-brand-primary]="currentTab === 'COMPLETED'"
          [class.text-brand-primary-dark]="currentTab === 'COMPLETED'"
          class="pb-3 px-4 font-bold text-xs border-b-2 border-transparent transition-all focus:outline-none text-text-sub"
        >
          ✓ Completed Reminders
        </button>
      </div>

      <!-- State: Loading -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div class="h-32 bg-white border border-brand-border rounded-2xl" *ngFor="let i of [1, 2]"></div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && getFilteredReminders().length === 0" class="bg-white border border-brand-border p-12 rounded-2xl text-center shadow-sm space-y-3">
        <p class="text-sm text-text-sub">No reminders found in this tab.</p>
        <button *ngIf="currentTab === 'PENDING'" (click)="openAddModal()" class="text-xs text-brand-primary font-bold underline">Create a new reminder</button>
      </div>

      <!-- Grid of Reminders -->
      <div *ngIf="!loading && getFilteredReminders().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          *ngFor="let r of getFilteredReminders()"
          [class]="getReminderClass(r)"
          class="p-6 border rounded-2xl flex flex-col justify-between h-36 shadow-sm hover:shadow transition-shadow duration-200 bg-white"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <span class="text-lg">
                {{ r.reminderType === 'SIP' ? '📈' : r.reminderType === 'BUDGET_ALERT' ? '⚠️' : '🔔' }}
              </span>
              <div>
                <h3 class="text-sm font-bold text-text-main leading-tight">{{ r.description }}</h3>
                <span class="text-[10px] text-text-sub uppercase font-bold tracking-wider">
                  Due: {{ r.dueDate | date:'MMM d, yyyy' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                *ngIf="!r.completed" 
                (click)="markAsCompleted(r)" 
                class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-600 focus:outline-none"
              >
                Complete
              </button>
              <button (click)="openEditModal(r)" class="text-xs text-brand-primary font-semibold">Edit</button>
              <button (click)="deleteReminder(r.reminderId)" class="text-xs text-red-500 font-semibold">Delete</button>
            </div>
          </div>

          <div class="flex justify-between items-end">
            <div>
              <p class="text-[9px] font-bold text-text-sub uppercase tracking-wider">Estimated Amount</p>
              <h4 class="text-base font-extrabold text-text-main mt-0.5">₹{{ r.amount | number:'1.2-2' }}</h4>
            </div>
            <span 
              [class]="r.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : isOverdue(r.dueDate) ? 'bg-red-50 text-red-700 border-red-100' : 'bg-brand-primary-light text-brand-primary-dark border-brand-border'"
              class="px-2 py-0.5 border rounded-lg text-[9px] font-extrabold uppercase tracking-wider"
            >
              {{ r.completed ? 'Completed' : isOverdue(r.dueDate) ? 'Overdue' : 'Upcoming' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">{{ editingReminderId ? 'Edit Reminder' : 'Set New Reminder' }}</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form [formGroup]="reminderForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <!-- Description -->
            <div>
              <label for="description" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Description / Memo</label>
              <input 
                id="description" 
                type="text" 
                formControlName="description" 
                placeholder="e.g. SIP Payment, Electricity Bill"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('description')" class="text-xs text-red-500 mt-1">Description is required</p>
            </div>

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Due Amount (₹)</label>
              <input 
                id="amount" 
                type="number" 
                formControlName="amount" 
                placeholder="0"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('amount')" class="text-xs text-red-500 mt-1">Amount is required</p>
            </div>

            <!-- Due Date -->
            <div>
              <label for="dueDate" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Due Date</label>
              <input 
                id="dueDate" 
                type="date" 
                formControlName="dueDate"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
              >
              <p *ngIf="isFieldInvalid('dueDate')" class="text-xs text-red-500 mt-1">Due date is required</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Reminder Type -->
              <div>
                <label for="reminderType" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Notification Type</label>
                <select 
                  id="reminderType"
                  formControlName="reminderType"
                  class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                >
                  <option value="BILL_PAYMENT">Bill Payment</option>
                  <option value="SIP">Investment (SIP)</option>
                  <option value="BUDGET_ALERT">Budget Warning</option>
                  <option value="OTHER">Other alert</option>
                </select>
              </div>

              <!-- Completed flag (only when editing) -->
              <div *ngIf="editingReminderId" class="flex items-center pt-5">
                <input 
                  id="completed" 
                  type="checkbox" 
                  formControlName="completed"
                  class="w-4 h-4 text-brand-primary border-brand-border rounded focus:ring-brand-primary bg-brand-bg"
                >
                <label for="completed" class="ml-2 text-xs font-bold text-text-sub uppercase tracking-wider">Mark Completed</label>
              </div>
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
                {{ formSubmitting ? 'Saving...' : 'Save Reminder' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RemindersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private reminderService = inject(ReminderService);

  reminders: any[] = [];
  loading = true;
  showModal = false;
  editingReminderId: string | null = null;
  formSubmitting = false;
  userId = '';
  currentTab = 'PENDING';

  reminderForm: FormGroup = this.fb.group({
    description: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    dueDate: ['', [Validators.required]],
    reminderType: ['BILL_PAYMENT', [Validators.required]],
    completed: [false]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.loadReminders();
    }
  }

  loadReminders() {
    this.loading = true;
    this.reminderService.getReminders(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.reminders = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reminders', err);
        this.loading = false;
      }
    });
  }

  getFilteredReminders(): any[] {
    if (this.currentTab === 'COMPLETED') {
      return this.reminders.filter(r => r.completed);
    }
    return this.reminders.filter(r => !r.completed);
  }

  getReminderClass(r: any): string {
    if (r.completed) return 'border-brand-border hover:bg-brand-bg opacity-75';
    if (this.isOverdue(r.dueDate)) return 'border-red-100 hover:bg-red-50/30';
    return 'border-brand-border hover:bg-brand-bg';
  }

  isOverdue(dateStr: string): boolean {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const now = new Date();
    // set times to midnight for comparison
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return due < now;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.reminderForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openAddModal() {
    this.editingReminderId = null;
    
    // Default due date to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().substring(0, 10);

    this.reminderForm.reset({
      description: '',
      amount: '',
      dueDate: dateStr,
      reminderType: 'BILL_PAYMENT',
      completed: false
    });
    this.showModal = true;
  }

  openEditModal(reminder: any) {
    this.editingReminderId = reminder.reminderId;
    this.reminderForm.reset({
      description: reminder.description,
      amount: reminder.amount,
      dueDate: reminder.dueDate ? reminder.dueDate.substring(0, 10) : '',
      reminderType: reminder.reminderType,
      completed: reminder.completed
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.reminderForm.invalid) {
      this.reminderForm.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const formVal = this.reminderForm.value;
    const payload = {
      ...formVal,
      userId: this.userId
    };

    if (this.editingReminderId) {
      this.reminderService.updateReminder(this.editingReminderId, payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadReminders();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to update reminder.');
        }
      });
    } else {
      this.reminderService.createReminder(payload).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.closeModal();
          this.loadReminders();
        },
        error: (err) => {
          this.formSubmitting = false;
          alert(err?.error?.message || 'Failed to set reminder.');
        }
      });
    }
  }

  markAsCompleted(reminder: any) {
    const payload = {
      ...reminder,
      userId: this.userId,
      completed: true
    };
    this.reminderService.updateReminder(reminder.reminderId, payload).subscribe({
      next: () => {
        this.loadReminders();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to complete reminder.');
      }
    });
  }

  deleteReminder(id: string) {
    if (confirm('Are you sure you want to delete this reminder?')) {
      this.reminderService.deleteReminder(id).subscribe({
        next: () => {
          this.loadReminders();
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to delete reminder.');
        }
      });
    }
  }
}
