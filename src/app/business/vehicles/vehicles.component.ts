import { Component } from '@angular/core';
import { VehiclesheaderComponent } from "./shared/vehicles-header/vehiclesheader.component";
import { VehiclesstatisticComponent } from "./shared/vehicles-statistic/vehiclesstatistic.component";
import VehiclesgridComponent from "./shared/vehicles-grid/vehiclesgrid.component";
import VehicleDetailsComponent from './shared/vehicle-details/vehicle-details.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [VehiclesheaderComponent, VehiclesstatisticComponent, VehiclesgridComponent, VehicleDetailsComponent,
    RouterModule
  ],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export default class VehiclesComponent {
  showVehicleDetail = false;
  selectedVehicle: any;

  constructor(private router: Router) { }

  onCardClick(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.showVehicleDetail = true;
    this.router.navigate(['/vehiculos/detalles', vehicle.license_plate]);
  }

  onBack() {
    this.showVehicleDetail = false;
  }
}


