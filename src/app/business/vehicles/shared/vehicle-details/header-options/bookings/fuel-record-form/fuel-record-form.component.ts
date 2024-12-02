// Bodriular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { VehicleApiService } from '../../../../../services/vehicle-api.service';
import { SharedService } from '../../../../../../../core/services/shared.service';
import { FuelRecord, Stations } from '../../../../../../../core/interfaces/fuel_records';
import { Vehicle } from '../../../../../../../core/interfaces/vehicle';
import { ToastService } from '../../../../../../../core/services/toast.service';
import { ToastComponent } from '../../../../../../../shared/utils/toast/toast.component';

@Component({
  selector: 'app-fuel-record-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  templateUrl: './fuel-record-form.component.html',
})
export class FuelRecordFormComponent implements OnInit {
  @Output() fuelRecordCreated = new EventEmitter<void>();
  fuelRecordForm!: FormGroup;

  vehicler!: Vehicle;
  stations = Object.values(Stations)

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleApiService,
    private sharedService: SharedService,
    private toastService: ToastService
  ) {
    this.fuelRecordForm = this.fb.group({
      cost: ['', [Validators.required]],
      fuel_date: ['', [Validators.required]],
      liters: ['', [Validators.required]],
      notes: ['', [Validators.required]],
      odometer: ['', [Validators.required]],
      station: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.vehicleService.selectedVehicle$.subscribe((vehicle) => {
      this.vehicler = vehicle;
    });

    console.log(this.vehicler);
  }

  onSubmit(): void {
    if (this.fuelRecordForm.invalid) {
      return;
    }

    const rawDate = this.sharedService.convertToMySQLTimestamp(
      this.fuelRecordForm.value.fuel_date
    )

    const fuelRecord: FuelRecord = {
      cost: this.fuelRecordForm.value.cost,
      fuelDate: rawDate,
      liters: this.fuelRecordForm.value.liters,
      notes: this.fuelRecordForm.value.notes,
      odometer: this.fuelRecordForm.value.odometer,
      station: this.fuelRecordForm.value.station,
      vehicleId: this.vehicler.vehicle_id
    }

    this.createFuelRecord(fuelRecord);
  }

  createFuelRecord(fuelRecord: FuelRecord): void {
    this.vehicleService.createFuelRecord(fuelRecord).subscribe({
      next: () => {
        this.toastService.showToast('Combustible registrado', 'Se ha registrado el combustible para el vehículo.', 'success');
        this.fuelRecordCreated.emit();
        this.fuelRecordForm.reset();
      },
      error: (err) => {
        this.toastService.showToast('Error', err, 'error');
      }
    });
  }

  formatValue(event: any): void {
    let value = event.target.value;
    value = value.replace(/[^0-9.]/g, '');
    if (value) {
      value = parseFloat(value).toLocaleString();
    }
    event.target.value = value;
  }
}
