import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingResponse } from '../../../../core/interfaces/booking';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './recent-bookings.component.html',
})
export class RecentBookingsComponent {
  @Input() bookings: BookingResponse[] = [];
}
