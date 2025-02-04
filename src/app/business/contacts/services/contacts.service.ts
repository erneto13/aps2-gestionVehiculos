import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientResponse, Contacts } from '../../../core/interfaces/contacts';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private apiUrl = 'https://sgfa-backend-latest.onrender.com/api/contacts';

  constructor(private http: HttpClient) { }

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

  updateContactStatus(id: number, status: string): Observable<Contacts> {
    return this.http.patch<Contacts>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
