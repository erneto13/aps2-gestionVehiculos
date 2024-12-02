import { Component, Input, OnInit } from '@angular/core';
import { BookingResponse } from '../../../../core/interfaces/booking';
import { MapBooking } from '../../maps/components/map-booking.component';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [MapBooking],
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent implements OnInit {
  @Input() booking: BookingResponse | null = null;

  get origin(): [number, number] {
    if (this.booking) {
      return [this.booking.origin_lng, this.booking.origin_lat];
    }
    return [0, 0]; // Coordenadas predeterminadas
  }

  get destination(): [number, number] {
    if (this.booking) {
      return [this.booking.destination_lng, this.booking.destination_lat];
    }
    return [0, 0]; // Coordenadas predeterminadas
  }

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails() {

  }
}
