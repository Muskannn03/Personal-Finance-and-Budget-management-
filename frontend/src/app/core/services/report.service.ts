import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private api = inject(ApiService);

  getDashboardAnalytics(userId: string): Observable<any> {
    return this.api.get<any>('/reports/dashboard', { userId });
  }

  getCategorySpendingReport(userId: string, startDate: string, endDate: string): Observable<any> {
    return this.api.get<any>('/reports/spending', { userId, startDate, endDate });
  }

  getBudgetUtilizationReport(userId: string): Observable<any> {
    return this.api.get<any>('/reports/budget-utilization', { userId });
  }

  getMonthlyTrends(userId: string): Observable<any> {
    return this.api.get<any>('/reports/monthly-trend', { userId });
  }

  getRewardsSummary(userId: string): Observable<any> {
    return this.api.get<any>('/reports/rewards-summary', { userId });
  }
}
