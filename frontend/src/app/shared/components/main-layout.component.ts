import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  isExpanded = true;
  mobileMenuOpen = false;

  private pageInfo: Record<string, { title: string; icon: string; category: string }> = {
    '/dashboard': { title: 'Dashboard', icon: '📊', category: 'Overview' },
    '/transactions': { title: 'Transactions', icon: '💳', category: 'Ledger' },
    '/accounts': { title: 'Accounts & Wallets', icon: '🏦', category: 'Net Worth' },
    '/budgets': { title: 'Budgets & Guardrails', icon: '🎯', category: 'Planning' },
    '/goals': { title: 'Savings Goals', icon: '⚡', category: 'Milestones' },
    '/investments': { title: 'Investment Portfolio', icon: '📈', category: 'Assets' },
    '/risk-profile': { title: 'Risk Profiling', icon: '🛡️', category: 'Advisory' },
    '/reports': { title: 'Financial Analytics', icon: '📉', category: 'Intelligence' },
    '/reminders': { title: 'Reminders & Bills', icon: '🔔', category: 'Schedules' },
    '/rewards': { title: 'Rewards & Cashback', icon: '🎁', category: 'Perks' },
    '/settings': { title: 'Account Settings', icon: '⚙️', category: 'System' }
  };

  get currentPage() {
    const url = this.router.url.split('?')[0];
    return this.pageInfo[url] || { title: 'Financial Workspace', icon: '💼', category: 'Workspace' };
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
