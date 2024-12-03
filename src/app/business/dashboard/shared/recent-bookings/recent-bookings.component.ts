import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingResponse } from '../../../../core/interfaces/booking';

@Component({
  selector: 'app-recent-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './recent-bookings.component.html',
})
export class RecentBookingsComponent {
  @Input() bookings: BookingResponse[] = [];
}
