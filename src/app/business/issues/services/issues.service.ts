import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issue, Issues, IssueUpdate } from '../../../core/interfaces/issues';
import { catchError, Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private apiUrl = 'https://sgfa-backend-latest.onrender.com/api/v1/issues';

  private issueCreatedSource = new Subject<void>();
  issueCreated$ = this.issueCreatedSource.asObservable();

  constructor(private http: HttpClient) { }

  // ya no lo uso pero puede ser para la dashboard
  // o algo se me ocurrirá
  getIssues(): Observable<Issues[]> {
    return this.http.get<Issues[]>(this.apiUrl);
  }

  // obtener issues por tipo (admin)
  getIssueByType(type: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/type/${type}`);
  }

  // obtener issues por estado (admin)
  getIssueByStatus(status: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/status/${status}`);
  }

  // crear un nuevo issue
  pushIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  // obtener issues por tipo y usuario (para un usuario específico)
  getIssueByTypePerUser(type: string, user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/type/${type}/user/${user}`);
  }

  // obtener issues cerrados por usuario (para un usuario específico)
  getClosedIssuesByUser(user: string): Observable<Issues[]> {
    return this.http.get<Issues[]>(`${this.apiUrl}/closed/user/${user}`);
  }

  // actualizar el estado de un issue (admin)
  updateStatusIssue(id: number, status: string): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError((error) => {
        console.error('Error al actualizar estado:', error);
        return throwError(() => new Error('Error al actualizar estado'));
      })
    );
  }

  // eliminar un issue (admin)
  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // resolver un issue (admin o usuario autorizado)
  updateIssueResolution(issue: IssueUpdate): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${issue.issues_id}/resolve`, issue).pipe(
      catchError(this.handleError)
    );
  }

  // obtener un issue por su ID
  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // notificar cuando un issue es creado
  notifyIssueCreated(): void {
    this.issueCreatedSource.next();
  }

  // manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un problema';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error en el cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error en el servidor: código ${error.status}, mensaje ${error.error}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
