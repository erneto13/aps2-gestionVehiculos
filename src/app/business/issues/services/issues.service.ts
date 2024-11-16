import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issues } from '../../../core/interfaces/issues';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/v1/issues-list'

  // ya no lo uso, pero puede ser para el .lenght como 
  // para la dashboard o algo se me ocurrirá
  getIssues(): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}`);
  }

  // pal admin
  getIssueByType(type: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/type/${type}`);
  }

  // pal admin
  getIssueByStatus(status: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/status/${status}`);
  }

  // per user
  getIssueByTypePerUser(type: string, user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/type/${type}/user/${user}`);
  }

  // per user
  getClosedIssuesByUser(user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/closed/user/${user}`);
  }
}
