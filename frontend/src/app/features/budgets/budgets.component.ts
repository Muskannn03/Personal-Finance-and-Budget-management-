import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Budgets</h1>
      <p class="text-slate-600 mt-2">Set monthly spending limits per category and track utilization.</p>
    </div>
  `
})
export class BudgetsComponent {}
