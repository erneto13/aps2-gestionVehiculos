import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingResponse } from '../../../../core/interfaces/booking';

@Component({
  selector: 'app-bookings-table',
  standalone: true,
  imports: [],
  templateUrl: './bookings-table.component.html',
})
export class BookingsTableComponent {
  @Input() bookings: BookingResponse[] = [];
  tableHeaders: string[] = ['Vehículo', 'Conductor', 'Cliente', 'Fecha', 'Status', 'Destino', 'Acciones'];
  @Output() delete = new EventEmitter<number>();

  deleteBooking(id: number): void {
    this.delete.emit(id);
  }

  viewDetails(id: number): void {
    
  }
}
