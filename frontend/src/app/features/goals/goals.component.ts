import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Savings Goals</h1>
      <p class="text-slate-600 mt-2">Plan your long-term purchases and track current target progress.</p>
    </div>
  `
})
export class GoalsComponent {}
