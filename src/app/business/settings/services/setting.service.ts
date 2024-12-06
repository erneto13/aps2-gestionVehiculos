import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDriver } from '../../../core/interfaces/drivers';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private apiUrl = 'http://localhost:8080/api/v1/user-driver';

  constructor(private http: HttpClient) { }

  getAllUserDrivers(): Observable<UserDriver[]> {
    return this.http.get<UserDriver[]>(this.apiUrl);
  }

  getUserDriverById(id: number): Observable<UserDriver> {
    return this.http.get<UserDriver>(`${this.apiUrl}/${id}`);
  }

  createUserDriver(userDriver: UserDriver): Observable<UserDriver> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserDriver>(this.apiUrl, userDriver, { headers });
  }

  deleteUserDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}