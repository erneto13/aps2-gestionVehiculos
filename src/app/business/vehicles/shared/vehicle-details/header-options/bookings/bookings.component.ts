import { Component } from '@angular/core';
import { Vehicle } from '../../../../../../core/interfaces/vehicle';
import { BookingResponse } from '../../../../../../core/interfaces/booking';
import { VehicleApiService } from '../../../../services/vehicle-api.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BookingsService } from '../../../../../bookings/services/bookings.service';
import { FuelRecordResponse } from '../../../../../../core/interfaces/fuel_records';
import { DialogModule } from 'primeng/dialog';
import { FuelRecordFormComponent } from './fuel-record-form/fuel-record-form.component';
import { BookingsTableComponent } from './bookings-table/bookings-table.component';
import { FuelRecordsTableComponent } from './fuel-records-table/fuel-records-table.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DatePipe, CurrencyPipe,
    DialogModule, FuelRecordFormComponent,
    BookingsTableComponent, FuelRecordsTableComponent],
  templateUrl: './bookings.component.html',
})
export default class BookingsComponent {
  vehicle!: Vehicle;
  bookings: BookingResponse[] = [];
  fuelRecord: FuelRecordResponse[] = [];

  visible: boolean = false;

  constructor(
    private bookingsService: BookingsService,
    private vehicleService: VehicleApiService
  ) { }

  ngOnInit(): void {
    this.vehicleService.selectedVehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
      this.loadBookings();
      this.loadFuelRecords();
    });
  }

  loadBookings(): void {
    this.bookingsService.getBookingsForVehicle(this.vehicle.vehicle_id)
      .subscribe((bookings) => {
        this.bookings = bookings;
      });
  }

  loadFuelRecords(): void {
    this.vehicleService.getRecordsByVehicleId(this.vehicle.vehicle_id)
      .subscribe((fuelRecord) => {
        this.fuelRecord = fuelRecord;
        this.visible = false;
      });
  }

  onChange(): void {
    this.visible = !this.visible;
    console.log(this.visible)
  }
}
