import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Contacts } from '../../core/interfaces/contacts';
import { ContactsService } from '../../business/contacts/services/contacts.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';
import { ClientHeaderComponent } from './shared/client-header/client-header.component';
import { ClientTableComponent } from './shared/client-table/client-table.component';
import { SearchPaginationComponent } from './shared/search-pagination/search-pagination.component';
import { SpinnerComponent } from '../../shared/utils/spinner/spinner.component';
import { DialogModule } from 'primeng/dialog';
import { ClientFormComponent } from './shared/client-form/client-form.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    CommonModule,
    ClientHeaderComponent,
    ClientTableComponent,
    SearchPaginationComponent,
    SpinnerComponent,
    DialogModule,
    ClientFormComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export default class ContactsComponent implements OnInit {
  contacts: Contacts[] = [];
  columnas: any[] = ["Nombre", "Compania", "Teléfono", "Correo", "Servicio", "Status", "Acciones"];
  filteredContacts: Contacts[] = [];
  pagedContacts: Contacts[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  showContactModal: boolean = false;
  initials: string = '';
  visible: boolean = false;

  editModalVisible: boolean = false;
  contactToEdit: Contacts | null = null;

  constructor(
    private cs: ContactsService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.cs.getContacts()
      .subscribe(contacts => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
        this.updatePagination();
        this.visible = false;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePageContacts();
  }

  onSearch(searchTerm: string): void {
    const term = searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.phone.includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  onAddContact(): void {
    this.visible = true
  }

  private updatePagination(): void {
    this.totalItems = this.filteredContacts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePageContacts();
  }

  private updatePageContacts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    this.pagedContacts = this.filteredContacts.slice(startIndex, endIndex);
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  deleteContact(id: number): void {
    this.cs.deleteContact(id)
      .subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (error) => {
          console.error('Error deleting contact:', error);
        }
      });
  }

  onEditContact(contact: Contacts): void {
    this.contactToEdit = { ...contact };
    this.editModalVisible = true;
  }

  onContactUpdated(updatedContact: Contacts): void {
    const index = this.contacts.findIndex(c => c.contact_id === updatedContact.contact_id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
      this.updatePageContacts();
    }
    this.editModalVisible = false;
  }
}