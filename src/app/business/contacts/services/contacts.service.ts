import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contacts } from '../../../core/interfaces/contacts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(
    private http: HttpClient
  ) { }

  getContacts(): Observable<Contacts[]> {
    return this.http.get<Contacts[]>('http://localhost:8080/api/contacts');
  }
}
