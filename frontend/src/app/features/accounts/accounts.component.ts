import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Accounts</h1>
      <p class="text-slate-600 mt-2">Manage your cash, savings, checking and credit card balances.</p>
    </div>
  `
})
export class AccountsComponent {}
