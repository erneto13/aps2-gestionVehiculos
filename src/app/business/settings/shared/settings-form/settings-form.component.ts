import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDriver, UserDriverCredentials } from '../../../../core/interfaces/drivers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import e from 'express';
import { emit } from 'process';
import { DriversService } from '../../../drivers/services/drivers.service';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [],
  templateUrl: './settings-form.component.html',
})
export class SettingsFormComponent implements OnInit {
  @Output() userDriverCreated = new EventEmitter<void>();
  @Input() userDriver: UserDriverCredentials | null = null;
  @Output() userDriverUpdated = new EventEmitter<UserDriverCredentials>();

  userDriverForm!: FormGroup;
  drivers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private driverService: DriversService,
    private toastService: ToastService,
  ) {
    this.userDriverForm = this.fb.group({
      driver: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadDrivers();

    if (this.userDriver) {
      this.userDriverForm.patchValue({
        driver: this.userDriver.driverId,
        email: this.userDriver.email,
        password: this.userDriver.password
      })
    }
  }

  onSubmit(): void {
    if (this.userDriverForm.invalid) {
      this.toastService.showToast(
        'Error en el formulario',
        'Por favor, rellene todos los campos',
        'error'
      )
      return
    }

    const data: UserDriverCredentials = {
      driverId: this.userDriverForm.value.driver,
      email: this.userDriverForm.value.email,
      password: this.userDriverForm.value.password
    }

    this.createUserDriver(data);
  }

  createUserDriver(data: UserDriverCredentials): void {
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }
}
