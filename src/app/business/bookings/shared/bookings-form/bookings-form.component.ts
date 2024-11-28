// Bodriular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Core
import { BookingsService } from '../../services/bookings.service';
import { MapService, PlacesService } from '../../maps/services';
import { SharedService } from '../../../../core/services/shared.service';
import { Booking, BookingResponse } from '../../../../core/interfaces/booking';
import { SearchPlacesInput } from '../../maps/components/search-places.component';
import { MapScreenComponent } from '../../maps/screens/map-screen/map-screen.component';
import { MapViewComponent } from "../../maps/components/map-view/map-view.component";

@Component({
  selector: 'app-bookings-form',
  standalone: true,
  imports: [SearchPlacesInput, MapScreenComponent, MapViewComponent, ReactiveFormsModule],
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
    this.bookingForm = this.fb.group({
      vehicle_id: ['', [Validators.required]],
      driver_id: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      origin_location: ['', [Validators.required]],
      destination_location: ['', [Validators.required]],
      notes: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadBookings();
  }

  onSubmit(): void {
    // if (this.bookingForm.invalid) {
    //   console.error('Form is invalid');
    //   return;
    // }

    const currentTimeStamp = this.sharedService.getMySQLTimestamp();

    const rawDateStart = this.sharedService.convertToMySQLTimestamp(
      this.bookingForm.value.start_date
    )
    const rawDateEnd = this.sharedService.convertToMySQLTimestamp(
      this.bookingForm.value.end_date
    )

    const booking: Booking = {
      vehicle_id: this.bookingForm.value.vehicle_id,
      driver_id: this.bookingForm.value.driver_id,
      start_date: rawDateStart,
      end_date: rawDateEnd,
      status: 'PENDING',
      purpose: this.bookingForm.value.purpose,
      destination_location: this.bookingForm.value.destination_location,
      created_at: currentTimeStamp,
      updated_at: currentTimeStamp,
      notes: this.bookingForm.value.notes,
    };
    this.createBooking(booking);
  }

  createBooking(booking: Booking): void {
    // this.bookingsService.createBooking(booking).subscribe(() => {
    console.log(booking);
    this.bookingCreated.emit();
    this.bookingForm.reset();
    // })
  }

  loadBookings(): void {
    this.bookingsService.getAllBookings().subscribe((bookings) => {
      this.bookings = bookings;
    });
  }
}
