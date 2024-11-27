import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookingsService } from '../../services/bookings.service';
import { MapService, PlacesService } from '../../maps/services';
import { SharedService } from '../../../../core/services/shared.service';
import { BookingResponse } from '../../../../core/interfaces/booking';
import { SearchPlacesInput } from '../../maps/components/search-places.component';
import { MapScreenComponent } from '../../maps/screens/map-screen/map-screen.component';

@Component({
  selector: 'app-bookings-form',
  standalone: true,
  imports: [SearchPlacesInput, MapScreenComponent],
  templateUrl: './bookings-form.component.html',
})
export class BookingsFormComponent implements OnInit {
  @Output() bookingCreated = new EventEmitter<void>();
  bookingForm!: FormGroup;
  bookings: any[] = [];

  constructor(
    private fb: FormBuilder,
    private bookingsService: BookingsService,
    private map: MapService,
    private sharedService: SharedService,
    private placesService: PlacesService
  ) {
    // todo: crear el form group con los validators

  }

  ngOnInit(): void {
    this.loadBookings();
  }

  onSubmit(): void {
    // TODO: implementar lógica de push de booking
  }

  createBooking(booking: BookingResponse): void {
    this.bookingsService.createBooking(booking).subscribe(() => {
      this.bookingCreated.emit();
      this.bookingForm.reset();
    })
  }

  loadBookings(): void {
    this.bookingsService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
  }
}
