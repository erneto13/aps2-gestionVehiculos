import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { DriverResponse, Drivers } from '../../../../core/interfaces/drivers';
import { DriversService } from '../../services/drivers.service';
import { MediaService } from '../../../../core/services/media.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-drivers-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './drivers-form.component.html',
})
export class DriversFormComponent implements OnInit, OnChanges {
  @Output() driverCreated = new EventEmitter<void>();
  @Input() driver: Drivers | null = null;
  @Output() driverUpdated = new EventEmitter<Drivers>();
  driverForm!: FormGroup;
  drivers: any[] = [];
  url: string | null = null;

  constructor(
    private fb: FormBuilder,
    private driverService: DriversService,
    private mediaService: MediaService,
    private toastService: ToastService
  ) {
    this.driverForm = this.fb.group({
      name: ['', [Validators.required]],
      license_number: ['', [Validators.required]],
      license_category: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadDrivers();

    if (this.driver) {
      this.driverForm.patchValue({
        name: this.driver.name,
        license_number: this.driver.license_number,
        license_category: this.driver.license_category,
        email: this.driver.email,
        phone: this.driver.phone,
        address: this.driver.address,
      });
      this.url = this.driver.profile_picture;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['driver'] && this.driver) {
      this.driverForm.patchValue(this.driver);
      this.url = this.driver.profile_picture;
    }
  }

  onSubmit(): void {
    if (this.driverForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const driver: DriverResponse = {
      profile_picture: this.url!,
      name: this.driverForm.value.name,
      license_number: this.driverForm.value.license_number,
      license_category: this.driverForm.value.license_category,
      email: this.driverForm.value.email,
      phone: this.driverForm.value.phone,
      address: this.driverForm.value.address,
    };

    if (this.driver) {
      this.updateDriver({ ...driver, driver_id: this.driver.driver_id });
    } else {
      this.createDriver(driver);
    }
  }

  createDriver(driver: DriverResponse): void {
    this.driverService.addDriver(driver).subscribe(() => {
      this.driverCreated.emit();
      this.driverForm.reset();
      this.url = null;
    });
  }

  updateDriver(driver: Drivers): void {
    this.driverService.updateDriver(driver).subscribe((updatedDriver) => {
      this.driverUpdated.emit(updatedDriver);
      this.driverForm.reset();
      this.url = null;
    });
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.mediaService.uploadSingleFile(formData).subscribe(
        res => {
          this.url = res.url;
        },
        error => {
          console.error('Error uploading image', error);
        }
      );
    }
  }

  formatLicenseNumber(event: any): void {
    let input = event.target.value;
    input = input.replace(/[^a-zA-Z0-9]/g, '');
    input = input.toUpperCase();
    if (input.length > 4) {
      input = input.substring(0, 4) + '-' + input.substring(4);
    }
    if (input.length > 11) {
      input = input.substring(0, 11) + '-' + input.substring(11);
    }
    event.target.value = input;
  }

  limitPhoneLength(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }
  
  preventInvalidKeys(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
}
