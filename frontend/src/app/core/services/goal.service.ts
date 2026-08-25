import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private api = inject(ApiService);

  getGoals(userId: string): Observable<any> {
    return this.api.get<any>(`/goals/user/${userId}`);
  }

  createGoal(goalData: any): Observable<any> {
    return this.api.post<any>('/goals', goalData);
  }

  updateGoal(goalId: string, goalData: any): Observable<any> {
    return this.api.put<any>(`/goals/${goalId}`, goalData);
  }

  deleteGoal(goalId: string): Observable<any> {
    return this.api.delete<any>(`/goals/${goalId}`);
  }
}
