import { Component, OnInit } from '@angular/core';
import { Contacts } from '../../core/interfaces/contacts';
import { ContactsService } from '../../business/contacts/services/contacts.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [TableModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit {
  contacts?: Contacts[];
  by: any;
  
  constructor(
    private cs: ContactsService
  ) { }

  ngOnInit(): void {
    this.cs.getContacts()
    .subscribe(contacts => {
      this.contacts = contacts;
    });
  }

}
