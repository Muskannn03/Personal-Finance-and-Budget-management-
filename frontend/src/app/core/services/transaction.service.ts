import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private api = inject(ApiService);

  getTransactions(params: {
    userId: string;
    accountId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Observable<any> {
    return this.api.get<any>('/transactions', params);
  }

  getTransactionById(id: string): Observable<any> {
    return this.api.get<any>(`/transactions/${id}`);
  }

  createTransaction(transactionData: any): Observable<any> {
    return this.api.post<any>('/transactions', transactionData);
  }

  updateTransaction(id: string, transactionData: any): Observable<any> {
    return this.api.put<any>(`/transactions/${id}`, transactionData);
  }

  deleteTransaction(id: string): Observable<any> {
    return this.api.delete<any>(`/transactions/${id}`);
  }
}
