import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from '../../../../core/interfaces/booking';

@Component({
  selector: 'app-bookings-table',
  standalone: true,
  imports: [],
  templateUrl: './bookings-table.component.html',
})
export class BookingsTableComponent {
  @Input() bookings: Booking[] = [];
  tableHeaders: string[] = ['Vehículo', 'Conductor', 'Fecha', 'Status', 'Origen', 'Destino', 'Acciones'];
  @Output() delete = new EventEmitter<number>();

  deleteBooking(id: number): void {
    this.delete.emit(id);
  }
}
