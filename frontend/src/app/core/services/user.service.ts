import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = inject(ApiService);

  getUserById(id: string): Observable<any> {
    return this.api.get<any>(`/users/${id}`);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.api.put<any>(`/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete<any>(`/users/${id}`);
  }
}
