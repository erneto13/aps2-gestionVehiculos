// Bodriular
import { Component, Output } from '@angular/core';
import {
  FormBuilder, FormGroup, FormsModule,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';

// Core
import { NewVehicle, VehiclesType } from '../../../../core/interfaces/vehicle';
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
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      type_vehicle: ['', [Validators.required]],
      image_url: ['hola', [Validators.required]]
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
      // Muestra los errores específicos de cada campo
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
      licensePlate: this.vehicleForm.value.licensePlate,
      make: this.vehicleForm.value.make,
      model: this.vehicleForm.value.model,
      status: 'AVAILABLE',
      type_vehicle: this.vehicleForm.value.type_vehicle,
      imageUrl: this.url,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };

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

  // Subir imagen
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

  // Formatear la placa
  formatLicensePlate(value: string): string {
    if (!value) return '';
    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    if (value.length > 7) value = `${value.slice(0, 7)}-${value.slice(7)}`;
    return value;
  }

  // Resetear el formulario
  resetForm(): void {
    this.vehicleForm.reset();
    this.url = '';
  }
}
