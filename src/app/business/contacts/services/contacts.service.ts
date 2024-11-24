import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientResponse, Contacts } from '../../../core/interfaces/contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private apiUrl = 'http://localhost:8080/api/v1/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contacts[]> {
    return this.http.get<Contacts[]>(`${this.apiUrl}`);
  }

  getContactById(id: number): Observable<Contacts> {
    return this.http.get<Contacts>(`${this.apiUrl}/${id}`);
  }

  addContact(contact: ClientResponse): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.apiUrl}`, contact);
  }

  updateContact(id: number, contact: Contacts): Observable<Contacts> {
    return this.http.put<Contacts>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
