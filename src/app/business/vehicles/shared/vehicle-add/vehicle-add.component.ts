import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { NewVehicle, Vehicle, VehiclesType } from '../../../../core/interfaces/vehicle';
import { MediaService } from '../../../../core/services/media.service';

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { VehicleApiService } from '../../services/vehicle-api.service';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-vehicle-add',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, FormsModule,
    ImageModule, CommonModule, InputTextModule, InputMaskModule
  ],
  templateUrl: './vehicle-add.component.html',
})
export class VehicleAddComponent {
  vehicleForm!: FormGroup;
  vehicleTypes = Object.values(VehiclesType)
  url!: any;

  constructor(private fb: FormBuilder, private ms: MediaService, private vi: VehicleApiService) {
    this.vehicleForm = this.fb.group({
      licensePlate: ['', [Validators.required]],
      make: ['', [Validators.required]],
      model: ['', [Validators.required]],
      status: ['', [Validators.required]],
      type_vehicle: ['', [Validators.required]],
      image_url: ['', [Validators.required]],
    });
  }

  onSubmit() {
    const currentTimestamp = this.getMySQLTimestamp();

    const vehicleAttrivutes: NewVehicle = {
      licensePlate: this.vehicleForm.value.licensePlate,
      make: this.vehicleForm.value.make,
      model: this.vehicleForm.value.model,
      status: 'AVAILABLE',
      type_vehicle: this.vehicleForm.value.type_vehicle,
      imageUrl: 'hola',
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };
    console.log(vehicleAttrivutes)
  }

  upload(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.ms.uploadSingleFile(formData)
        .subscribe(res => {
          this.url = res.url;
        })
    }
  }

  /**
  * Obtiene el timestamp actual en formato MySQL
  * @returns string en formato 'YYYY-MM-DD HH:mm:ss'
  * Ejemplo: '2024-11-06 10:15:00'
  */
  getMySQLTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
