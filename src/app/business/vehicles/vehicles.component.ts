import { Component } from '@angular/core';
import { VehiclesheaderComponent } from "./shared/vehicles-header/vehiclesheader.component";
import { VehiclesstatisticComponent } from "./shared/vehicles-statistic/vehiclesstatistic.component";
import { VehiclesgridComponent } from "./shared/vehicles-grid/vehiclesgrid.component";

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
  imports: [VehiclesheaderComponent, VehiclesstatisticComponent, VehiclesgridComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export default class VehiclesComponent {
}
