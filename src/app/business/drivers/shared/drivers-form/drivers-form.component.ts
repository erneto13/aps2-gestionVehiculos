import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Core
import { DriverResponse, Drivers } from '../../../../core/interfaces/drivers';
import { DriversService } from '../../services/drivers.service';

// MapBox

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
  drivers: any[] = []


  constructor(private fb: FormBuilder, private driverService: DriversService) {

    this.driverForm = this.fb.group({
      name: ['', [Validators.required]],
      license_number: ['', [Validators.required]],
      license_category: ['', [Validators.required]],
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
        phone: this.driver.phone,
        address: this.driver.address,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['driver'] && this.driver) {
      this.driverForm.patchValue(this.driver);
    }
  }

  onSubmit(): void {
    if (this.driverForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    const driver: DriverResponse = {
      name: this.driverForm.value.name,
      license_number: this.driverForm.value.license_number,
      license_category: this.driverForm.value.license_category,
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
    })
  }

  updateDriver(driver: Drivers): void {
    this.driverService.updateDriver(driver).subscribe((updatedDriver) => {
      this.driverUpdated.emit(updatedDriver); 
      this.driverForm.reset();
    });
  }
  

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }
}
