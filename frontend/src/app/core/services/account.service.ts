import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private api = inject(ApiService);

  getAccounts(userId: string): Observable<any> {
    return this.api.get<any>(`/accounts/user/${userId}`);
  }

  getNetWorth(userId: string): Observable<any> {
    return this.api.get<any>(`/accounts/user/${userId}/net-worth`);
  }

  createAccount(accountData: any): Observable<any> {
    return this.api.post<any>('/accounts', accountData);
  }

  updateAccount(accountId: string, accountData: any): Observable<any> {
    return this.api.put<any>(`/accounts/${accountId}`, accountData);
  }

  deleteAccount(accountId: string): Observable<any> {
    return this.api.delete<any>(`/accounts/${accountId}`);
  }
}
