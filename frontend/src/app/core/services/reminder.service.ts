import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private api = inject(ApiService);

  getReminders(userId: string): Observable<any> {
    return this.api.get<any>(`/reminders/user/${userId}`);
  }

  getDueReminders(): Observable<any> {
    return this.api.get<any>('/reminders/due');
  }

  getReminderDetails(id: string): Observable<any> {
    return this.api.get<any>(`/reminders/${id}/details`);
  }

  createReminder(reminderData: any): Observable<any> {
    return this.api.post<any>('/reminders', reminderData);
  }

  updateReminder(id: string, reminderData: any): Observable<any> {
    return this.api.put<any>(`/reminders/${id}`, reminderData);
  }

  deleteReminder(id: string): Observable<any> {
    return this.api.delete<any>(`/reminders/${id}`);
  }
}
