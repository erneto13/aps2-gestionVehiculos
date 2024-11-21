import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issues, IssueUpdate, NewIssues } from '../../../core/interfaces/issues';
import { catchError, Observable, throwError } from 'rxjs';

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

  // pal admin
  pushIssue(issue: NewIssues): Observable<any> {
    return this.http.post(this.apiUrl + '/pull-issue/', issue);
  }

  // per user
  getIssueByTypePerUser(type: string, user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/type/${type}/user/${user}`);
  }

  // per user
  getClosedIssuesByUser(user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/closed/user/${user}`);
  }

  // todos estos pal admin
  updateStatusIssue(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status/${id}`, { status }, { responseType: 'text' as 'json' }).pipe(
      catchError((error) => {
        console.error('error actualizar:', error);
        return throwError('error tirado', error);
      })
    );
  }

  updateIssueResolution(issue: IssueUpdate): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/resolve/${issue.idissues}`,
      issue
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'problema del ';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `front: ${error.error.message}`;
    } else {
      errorMessage = `back con codigo: ${error.status}, y mensaje ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

}
