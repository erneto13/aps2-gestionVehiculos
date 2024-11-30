import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking, BookingResponse } from '../../../../core/interfaces/booking';
import { DialogModule } from 'primeng/dialog';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookings-table',
  standalone: true,
  imports: [DialogModule, BookingDetailsComponent, DatePipe],
  templateUrl: './bookings-table.component.html',
})
export class BookingsTableComponent {
  @Input() bookings: BookingResponse[] = [];
  tableHeaders: string[] = ['Vehículo', 'Conductor', 'Cliente', 'Fecha', 'Status', 'Destino', 'Acciones'];
  @Output() delete = new EventEmitter<number>();

  visibility: boolean = false;
  selectedBooking: BookingResponse | null = null;

  deleteBooking(id: number): void {
    this.delete.emit(id);
  }

  onChange() {
    this.visibility = !this.visibility;
  }

  viewDetails(bookingId: number) {
    this.selectedBooking = this.bookings.find(booking => booking.bookings_id === bookingId) || null;

    // Abre el diálogo
    this.visibility = true;
  }
}
