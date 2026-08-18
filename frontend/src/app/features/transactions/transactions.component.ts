import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Transactions</h1>
      <p class="text-slate-600 mt-2">Log and view historical expense and income receipts.</p>
    </div>
  `
})
export class TransactionsComponent {}
