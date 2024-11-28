// Bodriular
import { Component, OnInit } from '@angular/core';

// Core
import { BookingsTableComponent } from '../bookings-table/bookings-table.component';
import { BookingsFormComponent } from '../bookings-form/bookings-form.component';

// Pagination and SearchBar
import { ReminderSearchbarComponent } from '../../../reminders/shared/reminder-searchbar/reminder-searchbar.component';
import { ReminderPaginationComponent } from '../../../reminders/shared/reminder-pagination/reminder-pagination.component';
import { BookingResponse } from '../../../../core/interfaces/booking';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { BookingsService } from '../../services/bookings.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [ReminderPaginationComponent, ReminderSearchbarComponent,
    BookingsTableComponent, DialogModule, BookingsFormComponent
  ],
  templateUrl: './bookings-list.component.html',
})
export class BookingsListComponent implements OnInit {
  allBookings: BookingResponse[] = [];
  displayedBookings: BookingResponse[] = [];

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  searchTerm = '';
  visible: boolean = false;

  constructor(
    private bookingsService: BookingsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingsService.getAllBookings()
      .subscribe({
        next: (data) => {
          this.allBookings = data;
          this.filterAndPaginateReminders();
          this.visible = false;
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se lograron obtener las reservas',
            'error'
          )
        }
      })
  }

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
    let filtered = this.allBookings;
    if (this.searchTerm) {
      const search = this.searchTerm.toLocaleLowerCase();
      filtered = this.allBookings.filter(booking =>
        booking.purpose.toLocaleLowerCase().includes(search) ||
        booking.destination_location.toLocaleLowerCase().includes(search)
      )
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const startIndex = this.currentPage * this.pageSize;
    this.displayedBookings = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  deleteBookings(id: number): void {
    this.bookingsService.deleteBooking(id)
      .subscribe({
        next: () => {
          this.loadBookings();
          this.toastService.showToast(
            'Reserva eliminada correctamente.',
            'La reserva ha sido eliminada',
            'success'
          )
        },
        error: (error) => {
          this.toastService.showToast(
            'Se ha producido un error.',
            'No se logro eliminar la reserva',
            'error'
          )
        }
      })
  }

  onChange(): void {
    this.visible = !this.visible;
  }
}
