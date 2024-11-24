import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewReminder, Reminder } from '../../../core/interfaces/reminders';

@Injectable({
  providedIn: 'root'
})
export class RemindersService {

  api = 'http://localhost:8080/api/v1/reminders';

  constructor(private http: HttpClient) { }

  getAllReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.api}/reminders-list`);
  }

  createReminder(reminder: NewReminder): Observable<NewReminder> {
    return this.http.post<NewReminder>(this.api, reminder);
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
