// Bodriular
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { Vehicle } from '../../../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../../../services/vehicle-api.service';
import { MaintenanceComponent } from '../../../../maintenance/maintenance.component';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { MaintenanceFormComponent } from '../../../../maintenance/shared/maintenance-form/maintenance-form.component';
import { PdfService } from '../../../../../../core/services/pdf.service';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, MaintenanceComponent,
    DialogModule, MaintenanceFormComponent],
  templateUrl: './basic-info.component.html',
})
export default class BasicInfoComponent {
  vehicle!: Vehicle;
  visible: boolean = false;

  @ViewChild('maintenanceComponent') maintenanceComponent!: MaintenanceComponent;

  constructor(
    private vi: VehicleApiService,
    private pdf: PdfService
  ) { }

  ngOnInit() {
    this.vi.selectedVehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
    });
  }

  onMaintenanceCreated(): void {
    this.maintenanceComponent.getMaintenance();
    this.visible = false;
  }

  onChange(): void {
    this.visible = !this.visible;
  }

  downloadPDF(): void {
    const elementToPrint: any = document.getElementById('basic-info');

    html2canvas(elementToPrint, { scale: 2 }).then((canvas: any) => {
      const doc = new jsPDF();
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);

      doc.setProperties({
        title: 'Ficha técnica del vehículo',
        subject: 'Ficha técnica del vehículo',
        author: 'Bodriular',
      })

      doc.setFontSize(12);
      doc.text('Ficha técnica del vehículo', 105, 20);
      doc.save('ficha-tecnica-vehiculo.pdf');
    });
  }

}
