import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Drivers, UserDriverCredentials } from '../../../../core/interfaces/drivers';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { DriversService } from '../../../drivers/services/drivers.service';
import { CreateCredentials } from '../../../../core/interfaces/credentials';
import { CommonModule } from '@angular/common';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings-form.component.html',
})
export class SettingsFormComponent implements OnInit {
  @Output() userDriverCreated = new EventEmitter<void>();
  @Input() userDriver: UserDriverCredentials | null = null;
  @Output() userDriverUpdated = new EventEmitter<UserDriverCredentials>();

  drivers: Drivers[] = [];
  userDriverForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private driverService: DriversService,
    private toastService: ToastService,
    private settingsService: SettingService
  ) {
    this.userDriverForm = this.fb.group({
      driverId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%@^&*?])[A-Za-z\d!$%@^&*?]{8,}$/)  // Al menos una letra, un número y un signo
      ]],
      role: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadDrivers();
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

    const data: CreateCredentials = this.userDriverForm.value;
    this.createUserDriver(data);
  }

  async createUserDriver(data: UserDriverCredentials): Promise<void> {
    this.settingsService.createCredentials(data).subscribe({
      next: () => {
        this.toastService.showToast(
          'Usuario creado',
          'El usuario se ha creado correctamente',
          'success'
        );
        this.userDriverForm.reset();
        this.userDriverCreated.emit();
      },
      error: (err) => {
        this.toastService.showToast(
          'Error al crear usuario',
          'Hubo un problema al crear el usuario. Inténtelo de nuevo más tarde.',
          'error'
        );
      }
    });
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((drivers) => {
      this.drivers = drivers;
    });
  }
}
