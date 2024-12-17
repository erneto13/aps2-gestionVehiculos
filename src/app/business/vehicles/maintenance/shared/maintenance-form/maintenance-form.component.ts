import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Maintenance } from '../../../../../core/interfaces/maintenance';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';
import { MaintenanceService } from '../../services/maintenance.service';
import { Vehicle } from '../../../../../core/interfaces/vehicle';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../../../core/services/shared.service';
import { VehicleApiService } from '../../../services/vehicle-api.service';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './maintenance-form.component.html',
})

export class MaintenanceFormComponent implements OnInit {
  @Output() maintenanceCreated = new EventEmitter<void>();
  @Input() maintenance: Maintenance | null = null;
  @Output() maintenanceUpdated = new EventEmitter<Maintenance>();

  @Input() vehicle: Vehicle | null = null;

  maintenanceForm!: FormGroup;

  maintenanceTypes = [
    { label: 'Preventivo', value: 'Preventivo' },
    { label: 'Correctivo', value: 'Correctivo' },
  ];

  problemTypes: { label: string; value: string }[] = [];

  problemTypeOptions: { [key in 'Preventivo' | 'Correctivo']: { label: string; value: string }[] } = {
    Preventivo: [
      { label: 'Revisión general', value: 'Revisión general' },
      { label: 'Cambio de aceite', value: 'Cambio de aceite' },
      { label: 'Ajuste de frenos', value: 'Ajuste de frenos' },
    ],
    Correctivo: [
      { label: 'Reparación del motor', value: 'Reparación del motor' },
      { label: 'Cambio de batería', value: 'Cambio de batería' },
      { label: 'Reparación de suspensión', value: 'Reparación de suspensión' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private sharedService: SharedService,
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleApiService
  ) {
    this.maintenanceForm = this.fb.group({
      maintenance_type: ['', [Validators.required]],
      maintenance_problem_type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      kilometers: ['', [Validators.required]],
      mechanic: ['', [Validators.required]],
      created_at: ['', [Validators.required]],
    });

    this.problemTypes = [];
  }

  ngOnInit(): void {
    this.maintenanceForm.get('maintenance_type')?.valueChanges.subscribe((value) => {
      this.updateProblemTypes(value);
    });
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.toastService.showToast(
        'Formulario inválido',
        'Por favor, complete todos los campos',
        'error'
      );
    }

    const rawDateStart = this.sharedService.convertToMySQLTimestamp(
      this.maintenanceForm.value.created_at
    );


    const maintenance: Maintenance = {
      vehicleId: this.vehicle?.vehicle_id ?? 0,
      maintenanceType: this.maintenanceForm.value.maintenance_type,
      maintenanceProblemType: this.maintenanceForm.value.maintenance_problem_type,
      description: this.maintenanceForm.value.description,
      cost: this.maintenanceForm.value.cost,
      kilometers: this.maintenanceForm.value.kilometers,
      status: 'PENDING',
      created_at: rawDateStart,
      updated_at: '',
      mechanic: this.maintenanceForm.value.mechanic,
    }

    this.scheduleMaintenance(maintenance);
  }

  scheduleMaintenance(maintenance: Maintenance): void {
    this.maintenanceService.createMaintenanceRecord(maintenance).subscribe({
      next: () => {
        this.toastService.showToast(
          'Mantenimiento programado',
          'El mantenimiento ha sido programado exitosamente',
          'success'
        );

        this.updateStatusVehicle();
        this.maintenanceCreated.emit();
        this.maintenanceForm.reset();
      },
      error: (err) => {
        this.toastService.showToast(
          'Error al programar mantenimiento',
          'Ocurrió un error al intentar programar el mantenimiento',
          'error'
        );
      }
    });
  }

  updateStatusVehicle() {
    if (!this.vehicle?.vehicle_id) {
      this.toastService.showToast(
        'Error de datos',
        'No se encontró el ID del vehículo para actualizar su estado',
        'error'
      );
      return;
    }

    this.vehicleService.changeVehicleStatus(this.vehicle.vehicle_id, 'Maintenance').subscribe({
      next: () => {
        // nada
      },
      error: (err) => {
        console.error('Error actualizando el estado del vehículo:', err);
        this.toastService.showToast(
          'Error al actualizar el estado del vehículo',
          'Ocurrió un error al intentar actualizar el estado del vehículo: ' + (err.message || 'Desconocido'),
          'error'
        );
      },
    });
  }

  updateProblemTypes(maintenanceType: string) {
    this.problemTypes = this.problemTypeOptions[maintenanceType as 'Preventivo' | 'Correctivo'] || [];
    this.maintenanceForm.get('maintenance_problem_type')?.setValue('');
  }

  onMaintenanceTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.updateProblemTypes(selectElement.value);
  }
}
