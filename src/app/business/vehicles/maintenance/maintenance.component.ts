import { Component, Input, OnInit } from '@angular/core';
import { MaintenanceService } from './services/maintenance.service';
import { Vehicle } from '../../../core/interfaces/vehicle';
import { Maintenance, MaintenanceResponse } from '../../../core/interfaces/maintenance';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MaintenanceDetailsComponent } from './shared/maintenance-details/maintenance-details.component';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, DialogModule,
    MaintenanceDetailsComponent],
  templateUrl: './maintenance.component.html',
})
export class MaintenanceComponent implements OnInit {
  @Input() vehicle!: Vehicle;
  tableHeaders = ['Fecha', 'Kilometros', 'Tipo de mantenimiento', 'Tipo de problema', 'Status'];
  maintenance: MaintenanceResponse[] = [];

  visibilidad: boolean = false
  selectedMaintenance: MaintenanceResponse | null = null;

  constructor(
    private maintenanceService: MaintenanceService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

    this.getMaintenance();
  }

  openDialog(m: MaintenanceResponse) {
    this.selectedMaintenance = m;
    this.visibilidad = true;
  }

  getMaintenance() {
    this.maintenanceService.getMaintenanceRecordsByVehicle(this.vehicle.vehicle_id).subscribe({
      next: (maintenance) => {
        this.maintenance = maintenance;
        this.visibilidad = false
      },
      error: (err) => {
        this.toastService.showToast(
          'Error',
          'No se pudieron obtener los registros de mantenimiento',
          'error'
        )
      }
    });
  }
}
