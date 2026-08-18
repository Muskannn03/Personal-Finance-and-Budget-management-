import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 class="text-2xl font-bold text-slate-800">Financial Dashboard</h1>
      <p class="text-slate-600 mt-2">Welcome to your Personal Finance & Budget Management system.</p>
    </div>
  `
})
export class DashboardComponent {}
