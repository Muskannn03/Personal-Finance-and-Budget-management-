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
    <div class="space-y-8 text-text-main pb-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Reminders</h1>
            <span *ngIf="isDemoMode" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary-light text-brand-primary-dark border border-brand-primary/30">
              Demo Values Active
            </span>
          </div>
          <p class="text-text-sub text-sm mt-1">Never miss recurring bills, budget breaches or investment deposits.</p>
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
            Set Reminder
          </button>
        </div>
      </div>

      <!-- Tabs navigation -->
      <div class="flex border-b border-brand-border gap-2">
        <button 
          (click)="currentTab = 'PENDING'"
          [class.border-brand-primary]="currentTab === 'PENDING'"
          [class.text-brand-primary-dark]="currentTab === 'PENDING'"
          class="pb-3 px-4 font-bold text-xs border-b-2 border-transparent transition-all focus:outline-none text-text-sub"
        >
          🔔 Active Reminders ({{ getPendingCount() }})
        </button>
        <button 
          (click)="currentTab = 'COMPLETED'"
          [class.border-brand-primary]="currentTab === 'COMPLETED'"
          [class.text-brand-primary-dark]="currentTab === 'COMPLETED'"
          class="pb-3 px-4 font-bold text-xs border-b-2 border-transparent transition-all focus:outline-none text-text-sub"
        >
          ✓ Completed Reminders ({{ getCompletedCount() }})
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

      <!-- Reminders Grid -->
      <div *ngIf="!loading && getFilteredReminders().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          *ngFor="let rem of getFilteredReminders()" 
          class="bg-white border border-brand-border p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-200 relative overflow-hidden"
        >
          <div *ngIf="showGuide" class="mb-2 inline-flex items-center gap-1 text-[10px] font-bold text-brand-primary-dark bg-brand-primary-light px-2.5 py-0.5 rounded-md w-fit">
            📍 Alert Notification: Date trigger, category relation, and status
          </div>

          <div>
            <div class="flex justify-between items-start">
              <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider">
                {{ rem.relatedType }}
              </span>
              <span class="text-xs font-bold" [class.text-red-500]="isUrgent(rem.dueDate)" [class.text-text-sub]="!isUrgent(rem.dueDate)">
                Due: {{ rem.dueDate | date:'MMM d, yyyy h:mm a' }}
              </span>
            </div>

            <h3 class="text-base font-bold text-text-main mt-3">{{ rem.title }}</h3>
          </div>

          <div class="mt-4 pt-3 border-t border-brand-border flex justify-between items-center">
            <span class="text-xs font-semibold" [class.text-emerald-600]="rem.status === 'COMPLETED'" [class.text-orange-500]="rem.status === 'PENDING'">
              {{ rem.status === 'COMPLETED' ? '✓ Resolved' : '⏳ Action Required' }}
            </span>

            <div class="flex gap-2">
              <button 
                *ngIf="rem.status === 'PENDING'" 
                (click)="markAsComplete(rem.reminderId)"
                class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 focus:outline-none"
              >
                Mark Done
              </button>
              <button 
                (click)="deleteReminder(rem.reminderId)"
                class="px-2 py-1 text-xs text-red-500 hover:text-red-700 font-bold focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Reminder Modal (Overlay) -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white border border-brand-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-5 border-b border-brand-border flex justify-between items-center">
            <h3 class="text-lg font-bold">Schedule Reminder</h3>
            <button (click)="closeModal()" class="text-text-sub hover:text-brand-primary-dark focus:outline-none">
              ✕
            </button>
          </div>

          <form [formGroup]="reminderForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Reminder Title</label>
              <input 
                type="text" 
                formControlName="title" 
                placeholder="e.g. Pay HDFC Credit Card Bill, Review SIP"
                class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Related Domain</label>
              <select 
                formControlName="relatedType"
                class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-xs focus:outline-none focus:border-brand-primary"
              >
                <option value="BILL">Recurring Bill / Utility</option>
                <option value="BUDGET">Budget Review</option>
                <option value="INVESTMENT">SIP / Investment Deposit</option>
                <option value="GOAL">Savings Goal Milestone</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Due Date & Time</label>
              <input 
                type="datetime-local" 
                formControlName="dueDate"
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
                Schedule Alert
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
  currentTab: 'PENDING' | 'COMPLETED' = 'PENDING';
  loading = false;
  isDemoMode = true;
  showGuide = true;

  showModal = false;
  formSubmitting = false;
  userId = '';

  liveReminders: any[] = [];

  readonly demoReminders = [
    {
      reminderId: 'rem-1',
      title: 'Pay ICICI Coral Credit Card Statement Bill',
      relatedType: 'BILL',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'PENDING'
    },
    {
      reminderId: 'rem-2',
      title: 'Review Monthly Grocery Budget Cap & Expenses',
      relatedType: 'BUDGET',
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      status: 'PENDING'
    },
    {
      reminderId: 'rem-3',
      title: 'Transfer Monthly ₹10,000 SIP to Emergency Fund',
      relatedType: 'INVESTMENT',
      dueDate: new Date(Date.now() + 86400000 * 6).toISOString(),
      status: 'PENDING'
    },
    {
      reminderId: 'rem-4',
      title: 'Paid Electricity & Water Utility Bill',
      relatedType: 'BILL',
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'COMPLETED'
    }
  ];

  reminderForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    relatedType: ['BILL', [Validators.required]],
    dueDate: ['', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    this.userId = session ? session.userId : 'demo-user-id';

    this.applyDemoData();

    if (session) {
      this.loadReminders();
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
    this.reminders = [...this.demoReminders];
    this.loading = false;
  }

  private applyLiveData() {
    this.reminders = [...this.liveReminders];
    this.loading = false;
  }

  loadReminders() {
    this.reminderService.getReminders(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.liveReminders = res.data;
          if (!this.isDemoMode) {
            this.applyLiveData();
          }
        }
      },
      error: (err) => console.warn('Could not load live reminders', err)
    });
  }

  getFilteredReminders(): any[] {
    return this.reminders.filter(r => r.status === this.currentTab);
  }

  getPendingCount(): number {
    return this.reminders.filter(r => r.status === 'PENDING').length;
  }

  getCompletedCount(): number {
    return this.reminders.filter(r => r.status === 'COMPLETED').length;
  }

  isUrgent(dueDate: string): boolean {
    if (!dueDate) return false;
    const diff = new Date(dueDate).getTime() - Date.now();
    return diff < 86400000 * 3; // within 3 days
  }

  openAddModal() {
    this.reminderForm.reset({
      title: '',
      relatedType: 'BILL',
      dueDate: new Date(Date.now() + 86400000).toISOString().substring(0, 16)
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.reminderForm.invalid) return;

    this.formSubmitting = true;
    const formVal = this.reminderForm.value;

    if (this.isDemoMode) {
      const newRem = {
        reminderId: 'rem-' + Date.now(),
        title: formVal.title,
        relatedType: formVal.relatedType,
        dueDate: formVal.dueDate,
        status: 'PENDING'
      };
      this.reminders.unshift(newRem);
      this.formSubmitting = false;
      this.closeModal();
      return;
    }

    const payload = {
      ...formVal,
      userId: this.userId,
      status: 'PENDING'
    };

    this.reminderService.createReminder(payload).subscribe({
      next: () => {
        this.formSubmitting = false;
        this.closeModal();
        this.loadReminders();
      },
      error: (err) => {
        this.formSubmitting = false;
        alert(err?.error?.message || 'Failed to create reminder.');
      }
    });
  }

  markAsComplete(id: string) {
    if (this.isDemoMode) {
      const target = this.reminders.find(r => r.reminderId === id);
      if (target) target.status = 'COMPLETED';
      return;
    }
    this.reminderService.updateReminder(id, { status: 'COMPLETED' }).subscribe({
      next: () => this.loadReminders(),
      error: (err) => alert(err?.error?.message || 'Failed to complete reminder.')
    });
  }

  deleteReminder(id: string) {
    if (confirm('Are you sure you want to delete this reminder?')) {
      if (this.isDemoMode) {
        this.reminders = this.reminders.filter(r => r.reminderId !== id);
        return;
      }
      this.reminderService.deleteReminder(id).subscribe({
        next: () => this.loadReminders(),
        error: (err) => alert(err?.error?.message || 'Failed to delete reminder.')
      });
    }
  }
}
