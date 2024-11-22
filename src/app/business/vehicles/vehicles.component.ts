import { Component } from '@angular/core';
import { VehiclesheaderComponent } from "./shared/vehicles-header/vehiclesheader.component";
import { VehiclesstatisticComponent } from "./shared/vehicles-statistic/vehiclesstatistic.component";
import { VehiclesgridComponent } from "./shared/vehicles-grid/vehiclesgrid.component";
import { VehicleDetailsComponent } from "./shared/vehicle-details/vehicle-details.component";

interface Vehicle {
  id: number;
  plate: string;
  status: string;
  model: string;
  description: string;
  capacity: number;
  year: number;
  transmission: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [VehiclesheaderComponent, VehiclesstatisticComponent, VehiclesgridComponent, VehicleDetailsComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export default class VehiclesComponent {
  showVehicleDetail = false;
  selectedVehicle: any;

  onCardClick(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.showVehicleDetail = true;
  }

  onBack() {
    this.showVehicleDetail = false;
  }
}
