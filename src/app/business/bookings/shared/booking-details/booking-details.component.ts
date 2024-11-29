import { Component, Input, OnInit } from '@angular/core';
import { Booking, BookingResponse } from '../../../../core/interfaces/booking';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [],
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent implements OnInit {
  @Input() booking: BookingResponse | null = null;

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {

  }
}
