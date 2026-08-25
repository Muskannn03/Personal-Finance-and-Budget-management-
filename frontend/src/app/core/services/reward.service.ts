import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private api = inject(ApiService);

  getRewards(userId: string): Observable<any> {
    return this.api.get<any>(`/rewards/user/${userId}`);
  }

  createReward(rewardData: any): Observable<any> {
    return this.api.post<any>('/rewards', rewardData);
  }

  updateReward(id: string, rewardData: any): Observable<any> {
    return this.api.put<any>(`/rewards/${id}`, rewardData);
  }

  deleteReward(id: string): Observable<any> {
    return this.api.delete<any>(`/rewards/${id}`);
  }
}
