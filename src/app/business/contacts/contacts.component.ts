import { Component, HostListener, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table'; // Adjust the import path as necessary
import { Contacts } from '../../core/interfaces/contacts';
import { ContactsService } from '../../business/contacts/services/contacts.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [TableModule, FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export default class ContactsComponent implements OnInit {
  contacts: Contacts[] = [];
  columnas: any[] = ["Nombre", "Compania", "Teléfono", "Correo", "Servicio", "Status"];
  filteredContacts: Contacts[] = [];
  pagedContacts: Contacts[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  showModal: boolean = false;

  isDropdownOpen: boolean = false;
  search: string = '';

  selectedRowData: Contacts | null = null;
  showContactModal: boolean = false;
  initials: string = '';

  constructor(
    private cs: ContactsService
  ) { }

  ngOnInit(): void {
    this.cs.getContacts()
      .subscribe(contacts => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
        this.updatePagination();
      });
  }

  filterContacts(): void {
    const searchTerm = this.search.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.phone.includes(searchTerm)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalItems = this.filteredContacts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePageContacts();
  }

  updatePageContacts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    this.pagedContacts = this.filteredContacts.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageContacts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageContacts();
    }
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  openSettingsModal(): void {
    this.showModal = true;
    console.log('Modal abierto');
  }

  closeSettingsModal(): void {
    this.showModal = false;
    console.log('Modal cerrado');
    this.updatePageContacts();
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
    this.isDropdownOpen = false;
    this.showModal = false;
  }

  @HostListener('click', ['$event'])
  onRowClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (target.tagName === 'TD') {
      const row = target.closest('tr');
      if (row) {
        const cells = Array.from(row.cells);
        this.selectedRowData = {
          name: cells[0].innerText,
          company: cells[1].innerText,
          phone: cells[2].innerText,
          email: cells[3].innerText,
          service: cells[4].innerText,
          status: cells[5].innerText,
        } as Contacts;

        const [firstName, lastName] = this.selectedRowData.name.split(' ');
        this.initials = (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();

        this.showContactModal = true;
      }
    }
  }


  closeContactModal(): void {
    this.showContactModal = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
