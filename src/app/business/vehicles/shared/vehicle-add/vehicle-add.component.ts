// Bodriular
import { Component, Output } from '@angular/core';
import {
  FormBuilder, FormGroup, FormsModule,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';

// Core
import { FuelType, NewVehicle, TransmissionType, VehiclesType } from '../../../../core/interfaces/vehicle';
import { MediaService } from '../../../../core/services/media.service';
import { VehicleApiService } from '../../services/vehicle-api.service';
import { SharedService } from '../../../../core/services/shared.service';

// PrimeNG
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-vehicle-add',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    ImageModule, CommonModule, InputTextModule
  ],
  templateUrl: './vehicle-add.component.html',
})
export class VehicleAddComponent {
  @Output() closeModal = new EventEmitter<void>();

  vehicleForm: FormGroup;
  vehicleTypes = Object.values(VehiclesType);
  transmissionType = Object.values(TransmissionType);
  fuelType = Object.values(FuelType)
  isPlateValid: boolean = true;
  url!: string;

  constructor(
    private fb: FormBuilder,
    private ms: MediaService,
    private vi: VehicleApiService,
    private shared: SharedService
  ) {
    this.vehicleForm = this.createForm();
    this.handleLicensePlateChanges();
  }

  createForm(): FormGroup {
    return this.fb.group({
      licensePlate: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{3}-[0-9]{3}-[A-Z]?$/)
        ]
      ],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required]],
      color: ['', [Validators.required]],
      transmission_type: ['', [Validators.required]],
      fuel_type: ['', [Validators.required]],
      engine_type: ['', [Validators.required]],
      type_vehicle: ['', [Validators.required]],
    });
  }

  handleLicensePlateChanges(): void {
    this.vehicleForm.get('licensePlate')?.valueChanges.subscribe((value: string) => {
      const formatted = this.formatLicensePlate(value);
      if (formatted !== value) {
        this.vehicleForm.get('licensePlate')?.setValue(formatted, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      Object.keys(this.vehicleForm.controls).forEach(controlName => {
        const control = this.vehicleForm.get(controlName);
        if (control?.invalid) {
          console.log(`Field ${controlName} is invalid. Errors:`, control.errors);
        }
      });
      return;
    }

    const currentTimestamp = this.shared.getMySQLTimestamp();

    const vehicleAttrivutes: NewVehicle = {
      license_plate: this.vehicleForm.value.licensePlate,
      brand: this.vehicleForm.value.brand,
      model: this.vehicleForm.value.model,
      year: this.vehicleForm.value.year,
      color: this.vehicleForm.value.color,
      transmission_type: this.vehicleForm.value.transmission_type,
      fuel_type: this.vehicleForm.value.fuel_type,
      engine_type: this.vehicleForm.value.engine_type,
      type: this.vehicleForm.value.type_vehicle,
      status: 'Active',
      image_url: this.url,
      registration_date: currentTimestamp,
    };
    console.log(vehicleAttrivutes)
    this.addVehicle(vehicleAttrivutes);
  }

  addVehicle(vehicleAttrivutes: NewVehicle): void {
    this.vi.addVehicle(vehicleAttrivutes).subscribe(
      response => {
        console.log('Vehicle added successfully', response);
        this.vi.notifyVehicleAdded();
        this.resetForm();
        this.closeModal.emit();
      },
      error => {
        console.error('Error adding vehicle', error);
      }
    );
  }

  upload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.ms.uploadSingleFile(formData).subscribe(
        res => {
          this.url = res.url;
        },
        error => {
          console.error('Error uploading image', error);
        }
      );
    }
  }

  formatLicensePlate(value: string): string {
    if (!value) return '';
    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    if (value.length > 7) value = `${value.slice(0, 7)}-${value.slice(7)}`;
    return value;
  }

  resetForm(): void {
    this.vehicleForm.reset();
    this.url = '';
  }
}
