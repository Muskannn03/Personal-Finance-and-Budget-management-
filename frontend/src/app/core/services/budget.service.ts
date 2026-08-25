import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private api = inject(ApiService);

  getBudgets(userId: string): Observable<any> {
    return this.api.get<any>(`/budgets/user/${userId}`);
  }

  createBudget(budgetData: any): Observable<any> {
    return this.api.post<any>('/budgets', budgetData);
  }

  updateBudget(budgetId: string, budgetData: any): Observable<any> {
    return this.api.put<any>(`/budgets/${budgetId}`, budgetData);
  }

  deleteBudget(budgetId: string): Observable<any> {
    return this.api.delete<any>(`/budgets/${budgetId}`);
  }

  // Categories helper since budget forms need category IDs
  getCategories(userId: string): Observable<any> {
    return this.api.get<any>(`/categories/user/${userId}`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.api.post<any>('/categories', categoryData);
  }
}
