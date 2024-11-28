// Bodriular
import { Component } from '@angular/core';

// Core
import { BookingsTableComponent } from '../bookings-table/bookings-table.component';
import { BookingsFormComponent } from '../bookings-form/bookings-form.component';

// Pagination and SearchBar
import { ReminderSearchbarComponent } from '../../../reminders/shared/reminder-searchbar/reminder-searchbar.component';
import { ReminderPaginationComponent } from '../../../reminders/shared/reminder-pagination/reminder-pagination.component';
import { BookingResponse } from '../../../../core/interfaces/booking';

// PrimeNG
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [ReminderPaginationComponent, ReminderSearchbarComponent,
    BookingsTableComponent, DialogModule, BookingsFormComponent
  ],
  templateUrl: './bookings-list.component.html',
})
export class BookingsListComponent {
  allBookings: BookingResponse[] = [];
  displayedBookings: BookingResponse[] = [];

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0;
    this.filterAndPaginateReminders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterAndPaginateReminders();
  }

  filterAndPaginateReminders() {
    throw new Error('Method not implemented.');
  }

  deleteBookings(id: number): void {
    throw new Error('Method not implemented.');
  }

  onChange(): void {
    this.visible = !this.visible;
  }
}
