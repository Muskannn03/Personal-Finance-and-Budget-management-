import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RiskProfileService {
  private api = inject(ApiService);

  getRiskProfile(userId: string): Observable<any> {
    return this.api.get<any>(`/risk-profiles/user/${userId}`);
  }

  createRiskProfile(profileData: any): Observable<any> {
    return this.api.post<any>('/risk-profiles', profileData);
  }

  updateRiskProfile(id: string, profileData: any): Observable<any> {
    return this.api.put<any>(`/risk-profiles/${id}`, profileData);
  }

  deleteRiskProfile(id: string): Observable<any> {
    return this.api.delete<any>(`/risk-profiles/${id}`);
  }
}
