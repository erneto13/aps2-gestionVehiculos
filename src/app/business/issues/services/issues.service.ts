import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issues } from '../../../core/interfaces/issues';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private apiUrl = 'http://localhost:8080/api/v1/issues-list'

  constructor(private http: HttpClient) { }

  getIssues(): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}`);
  }

  getIssueByType(type: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/${type}`);
  }

  getIssueByStatus(status: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/status/${status}`);
  }
}
