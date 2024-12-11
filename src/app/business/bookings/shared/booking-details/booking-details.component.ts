import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BookingResponse } from '../../../../core/interfaces/booking';
import { MapBooking } from '../../maps/components/map-booking.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [MapBooking, CommonModule],
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent implements OnChanges {
  @Input() booking: BookingResponse | null = null;

  origin: [number, number] = [0, 0];
  destination: [number, number] = [0, 0];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] && this.booking) {
      this.origin = [this.booking.origin_lng, this.booking.origin_lat];
      this.destination = [this.booking.destination_lng, this.booking.destination_lat];
    }
  }

  get originCoords(): [number, number] {
    return this.origin;
  }

  get destinationCoords(): [number, number] {
    return this.destination;
  }
}
