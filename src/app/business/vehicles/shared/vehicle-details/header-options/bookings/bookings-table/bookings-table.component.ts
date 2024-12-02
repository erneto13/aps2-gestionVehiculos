import { Component, Input } from '@angular/core';
import { BookingResponse } from '../../../../../../../core/interfaces/booking';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookings-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './bookings-table.component.html',
})
export class BookingsTableComponent {
  @Input() bookings: BookingResponse[] = [];
}
