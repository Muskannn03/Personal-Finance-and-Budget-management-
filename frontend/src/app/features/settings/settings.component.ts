import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 text-text-main max-w-3xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-text-main">Account Settings</h1>
        <p class="text-text-sub text-sm mt-1">Manage your personal profile, notification preferences, and account security.</p>
      </div>

      <!-- Settings Layout -->
      <div class="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
        <!-- Vertical Tabs Menu -->
        <div class="border-r border-brand-border bg-brand-bg/50 p-4 space-y-1">
          <button 
            (click)="currentTab = 'profile'"
            [class.bg-brand-primary-light]="currentTab === 'profile'"
            [class.text-brand-primary-dark]="currentTab === 'profile'"
            [class.font-bold]="currentTab === 'profile'"
            class="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold hover:bg-brand-bg transition-colors focus:outline-none text-text-sub"
          >
            👤 Profile Info
          </button>
          <button 
            (click)="currentTab = 'preferences'"
            [class.bg-brand-primary-light]="currentTab === 'preferences'"
            [class.text-brand-primary-dark]="currentTab === 'preferences'"
            [class.font-bold]="currentTab === 'preferences'"
            class="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold hover:bg-brand-bg transition-colors focus:outline-none text-text-sub"
          >
            ⚙️ Preferences
          </button>
          <button 
            (click)="currentTab = 'security'"
            [class.bg-brand-primary-light]="currentTab === 'security'"
            [class.text-brand-primary-dark]="currentTab === 'security'"
            [class.font-bold]="currentTab === 'security'"
            class="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold hover:bg-brand-bg transition-colors focus:outline-none text-text-sub"
          >
            🔒 Security & Session
          </button>
          <button 
            (click)="currentTab = 'danger'"
            [class.bg-red-50]="currentTab === 'danger'"
            [class.text-red-700]="currentTab === 'danger'"
            [class.font-bold]="currentTab === 'danger'"
            class="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold hover:bg-red-50/50 transition-colors focus:outline-none text-text-sub"
          >
            ⚠️ Danger Zone
          </button>
        </div>

        <!-- Settings Tabs Panel Content -->
        <div class="col-span-3 p-6 md:p-8">
          <!-- Loader -->
          <div *ngIf="loading" class="p-8 text-center text-xs text-text-sub animate-pulse">
            Loading settings data...
          </div>

          <div *ngIf="!loading">
            <!-- Alert success / errors -->
            <div *ngIf="alertMessage" class="mb-6 p-4 rounded-xl text-xs font-semibold border"
                 [class.bg-green-50]="alertType === 'success'" [class.text-green-700]="alertType === 'success'" [class.border-green-100]="alertType === 'success'"
                 [class.bg-red-50]="alertType === 'danger'" [class.text-red-700]="alertType === 'danger'" [class.border-red-100]="alertType === 'danger'">
              {{ alertMessage }}
            </div>

            <!-- Tab: Profile -->
            <div *ngIf="currentTab === 'profile'" class="space-y-6">
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-text-sub">Profile Information</h3>
                <p class="text-xs text-text-sub mt-0.5">Update your visual profile and email contact channels.</p>
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4 max-w-md">
                <div>
                  <label for="name" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    id="name" 
                    type="text" 
                    formControlName="name" 
                    class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                  >
                </div>
                <div>
                  <label for="email" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    formControlName="email" 
                    class="w-full px-4 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary opacity-60 cursor-not-allowed"
                    readonly
                  >
                  <span class="text-[10px] text-text-sub mt-1 block">Account emails cannot be changed for database synchronization.</span>
                </div>

                <button 
                  type="submit" 
                  [disabled]="submitting"
                  class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl shadow-sm hover:shadow focus:outline-none disabled:opacity-50"
                >
                  {{ submitting ? 'Saving...' : 'Update Profile' }}
                </button>
              </form>
            </div>

            <!-- Tab: Preferences -->
            <div *ngIf="currentTab === 'preferences'" class="space-y-6">
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-text-sub">Application Preferences</h3>
                <p class="text-xs text-text-sub mt-0.5">Customize your personal visual configuration settings.</p>
              </div>

              <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()" class="space-y-4 max-w-md">
                <div>
                  <label for="currency" class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Currency Preference</label>
                  <select 
                    id="currency"
                    formControlName="currencyPreference"
                    class="w-full px-3 py-2.5 border border-brand-border bg-brand-bg rounded-xl text-sm focus:outline-none focus:border-brand-primary"
                  >
                    <option value="INR">INR (₹) Indian Rupee</option>
                    <option value="USD">USD ($) US Dollar</option>
                    <option value="EUR">EUR (€) Euro</option>
                    <option value="GBP">GBP (£) British Pound</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  [disabled]="submitting"
                  class="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-bold rounded-xl shadow-sm hover:shadow focus:outline-none disabled:opacity-50"
                >
                  {{ submitting ? 'Saving...' : 'Save Preferences' }}
                </button>
              </form>
            </div>

            <!-- Tab: Security -->
            <div *ngIf="currentTab === 'security'" class="space-y-6">
              <div>
                <h3 class="text-sm font-bold uppercase tracking-wider text-text-sub">Active Session Cryptography</h3>
                <p class="text-xs text-text-sub mt-0.5">Secure JWT details attached to your API communication requests.</p>
              </div>

              <div class="p-4 bg-brand-bg border border-brand-border rounded-xl space-y-3">
                <div>
                  <span class="text-[9px] font-bold text-text-sub uppercase tracking-wider">Active Token (JWT)</span>
                  <div class="w-full p-3 bg-white border border-brand-border rounded-lg font-mono text-[9px] text-text-sub break-all max-h-24 overflow-y-auto mt-1">
                    {{ activeToken }}
                  </div>
                </div>
                
                <div class="flex items-center gap-2 text-xs font-semibold text-green-600">
                  <span class="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  Session Token is Authenticated
                </div>
              </div>
            </div>

            <!-- Tab: Danger Zone -->
            <div *ngIf="currentTab === 'danger'" class="space-y-6">
              <div class="p-5 border border-red-200 bg-red-50/50 rounded-2xl space-y-4">
                <div>
                  <h3 class="text-sm font-bold text-red-700 uppercase tracking-wider">Delete Account</h3>
                  <p class="text-xs text-red-600 mt-1 leading-normal">
                    Warning: Deleting your account will purge all associated wallets, categories, transactions, budgets, goals, and security profiles. This action is irreversible.
                  </p>
                </div>
                <button 
                  (click)="deleteAccount()"
                  class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl focus:outline-none shadow-sm hover:shadow"
                >
                  Delete Account Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentTab = 'profile';
  loading = true;
  submitting = false;
  userId = '';
  userData: any | null = null;
  activeToken = '';

  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['']
  });

  preferencesForm: FormGroup = this.fb.group({
    currencyPreference: ['INR', [Validators.required]]
  });

  ngOnInit() {
    const session = this.authService.currentUser();
    if (session) {
      this.userId = session.userId;
      this.activeToken = this.authService.getToken() || '';
      this.loadSettings();
    }
  }

  loadSettings() {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.userData = res.data;
          this.profileForm.patchValue({
            name: this.userData.name,
            email: this.userData.email
          });
          this.preferencesForm.patchValue({
            currencyPreference: this.userData.currencyPreference || 'INR'
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading settings', err);
        this.loading = false;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.alertMessage = '';
    const payload = {
      ...this.userData,
      name: this.profileForm.value.name
    };

    this.userService.updateUser(this.userId, payload).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.alertMessage = 'Profile name updated successfully!';
        this.alertType = 'success';
        
        // Update user session in localStorage to reflect name update instantly
        const sessionStr = localStorage.getItem('user_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          session.name = payload.name;
          localStorage.setItem('user_session', JSON.stringify(session));
        }
      },
      error: (err) => {
        this.submitting = false;
        this.alertMessage = err?.error?.message || 'Failed to update profile name.';
        this.alertType = 'danger';
      }
    });
  }

  savePreferences() {
    this.submitting = true;
    this.alertMessage = '';
    const payload = {
      ...this.userData,
      currencyPreference: this.preferencesForm.value.currencyPreference
    };

    this.userService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.alertMessage = 'Currency preference updated successfully!';
        this.alertType = 'success';
      },
      error: (err) => {
        this.submitting = false;
        this.alertMessage = err?.error?.message || 'Failed to update preferences.';
        this.alertType = 'danger';
      }
    });
  }

  deleteAccount() {
    const confirmation = confirm('Are you absolutely sure you want to delete your BACHAT account? All your transaction data, balances, and budgets will be permanently deleted.');
    if (confirmation) {
      const secondaryConfirmation = prompt('To confirm deletion, please type "DELETE" below:');
      if (secondaryConfirmation === 'DELETE') {
        this.userService.deleteUser(this.userId).subscribe({
          next: () => {
            alert('Your account has been deleted successfully.');
            this.authService.logout();
          },
          error: (err) => {
            alert(err?.error?.message || 'Failed to delete account.');
          }
        });
      } else {
        alert('Account deletion cancelled.');
      }
    }
  }
}
