// Bodriular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Core
import { BookingsService } from '../../services/bookings.service';
import { SharedService } from '../../../../core/services/shared.service';
import { Booking } from '../../../../core/interfaces/booking';
import { MapScreenComponent } from '../../maps/screens/map-screen/map-screen.component';
import { VehicleApiService } from '../../../vehicles/services/vehicle-api.service';
import { ContactsService } from '../../../contacts/services/contacts.service';
import { DriversService } from '../../../drivers/services/drivers.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MapService, PlacesService } from '../../maps/services';
import { Contacts } from '../../../../core/interfaces/contacts';
import { Vehicle } from '../../../../core/interfaces/vehicle';
import { Drivers } from '../../../../core/interfaces/drivers';
import { Geofence } from '../../../../core/interfaces/geofence';

@Component({
  selector: 'app-bookings-form',
  standalone: true,
  imports: [MapScreenComponent, ReactiveFormsModule],
  templateUrl: './bookings-form.component.html',
})
export class BookingsFormComponent implements OnInit {
  @Output() bookingCreated = new EventEmitter<void>();
  bookingForm!: FormGroup;
  vehicles: Vehicle[] = [];
  drivers: Drivers[] = [];
  clients: Contacts[] = [];
  destination: string | null = null;
  destinationAddress: string = '';

  geofenceRoute!: Geofence;

  constructor(
    private fb: FormBuilder,
    private bookingsService: BookingsService,
    private sharedService: SharedService,
    private vehicleApiService: VehicleApiService,
    private contactService: ContactsService,
    private driverService: DriversService,
    private toastService: ToastService,
    private placeService: PlacesService,
    private mapService: MapService
  ) {
    this.bookingForm = this.fb.group({
      vehicle_id: ['', [Validators.required]],
      driver_id: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      destination_location: ['', [Validators.required]],
      notes: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadVehicles();
    this.loadDrivers();

    this.placeService.destination$.subscribe((destination) => {
      this.destination = destination;
      if (destination) {
        this.destinationAddress = destination;
        this.bookingForm.patchValue({ destination_location: this.destinationAddress });
      }
    });

    this.mapService.getGeofence().subscribe((geoFence) => {
      if (geoFence) {
        this.geofenceRoute = geoFence;
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.toastService.showToast('Error', 'Por favor, rellene todos los campos.', 'error');
      return;
    }

    const currentTimeStamp = this.sharedService.getMySQLTimestamp();
    const rawDateStart = this.sharedService.convertToMySQLTimestamp(
      this.bookingForm.value.start_date
    );
    const rawDateEnd = this.sharedService.convertToMySQLTimestamp(
      this.bookingForm.value.end_date
    );

    const booking: Booking = {
      vehicle_id: this.bookingForm.value.vehicle_id,
      driverId: this.bookingForm.value.driver_id,
      contact_id: this.bookingForm.value.client_id,
      start_date: rawDateStart,
      end_date: rawDateEnd,
      status: 'PENDING',
      purpose: this.bookingForm.value.purpose,
      destination_location: this.destinationAddress,
      created_at: currentTimeStamp,
      updated_at: currentTimeStamp,
      notes: this.bookingForm.value.notes,
      origin_lat: this.geofenceRoute.originLat,
      origin_lng: this.geofenceRoute.originLng,
      destination_lat: this.geofenceRoute.destinationLat,
      destination_lng: this.geofenceRoute.destinationLng
    };

    this.createBooking(booking);
  }

  createBooking(booking: Booking): void {
    this.bookingsService.createBooking(booking).subscribe({
      next: () => {
        this.toastService.showToast('Reserva agendada', 'La agenda ha sido reservada correctamente.', 'success');
        this.bookingCreated.emit();
        this.bookingForm.reset();
      },
      error: (err) => {
        this.toastService.showToast('Error', err, 'error');
      }
    });
  }

  loadVehicles(): void {
    this.vehicleApiService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles.filter(vehicle => vehicle.status === 'Active');
    });
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }

  loadClients(): void {
    this.contactService.getContacts().subscribe((clients) => {
      this.clients = clients.filter(client => client.status === 'Activo');
    });
  }
}
