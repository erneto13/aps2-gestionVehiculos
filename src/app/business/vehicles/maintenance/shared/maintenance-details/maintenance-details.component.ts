import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaintenanceResponse } from '../../../../../core/interfaces/maintenance';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MaintenanceService } from '../../services/maintenance.service';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-maintenance-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule],
  templateUrl: './maintenance-details.component.html',
})
export class MaintenanceDetailsComponent {
  @Input() maintenance!: MaintenanceResponse;
  @Output() maintenanceUpdated = new EventEmitter<void>();

  constructor(
    private maintenanceService: MaintenanceService,
    private toastService: ToastService
  ) { }

  finalizeMaintenance(): void {
    this.maintenanceService.updateMaintenanceStatus(this.maintenance.id!, 'COMPLETED').subscribe({
      next: () => {
        this.toastService.showToast(
          'Mantenimiento finalizado',
          'Se ha terminado el mantenimiento, el auto vuelve a estar disponible',
          'success'
        )
        this.maintenanceUpdated.emit();
      },
      error: (err) => {
        console.error('Error updating maintenance status', err);
      }
    });
  }
}
