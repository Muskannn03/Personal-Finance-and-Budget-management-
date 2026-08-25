import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private api = inject(ApiService);

  getInvestments(userId: string): Observable<any> {
    return this.api.get<any>(`/investments/user/${userId}`);
  }

  getInvestmentsByGoal(goalId: string): Observable<any> {
    return this.api.get<any>(`/investments/goal/${goalId}`);
  }

  createInvestment(investmentData: any): Observable<any> {
    return this.api.post<any>('/investments', investmentData);
  }

  updateInvestment(id: string, investmentData: any): Observable<any> {
    return this.api.put<any>(`/investments/${id}`, investmentData);
  }

  deleteInvestment(id: string): Observable<any> {
    return this.api.delete<any>(`/investments/${id}`);
  }
}
