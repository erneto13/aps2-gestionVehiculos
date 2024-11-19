import { Component } from '@angular/core';
import { VehiclesheaderComponent } from "./shared/vehicles-header/vehiclesheader.component";
import { VehiclesstatisticComponent } from "./shared/vehicles-statistic/vehiclesstatistic.component";
import { VehiclecardComponent } from './shared/vehicle-card/vehiclecard.component';

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
  imports: [VehiclesheaderComponent, VehiclesstatisticComponent, VehiclecardComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export default class VehiclesComponent {
  vehicles: Vehicle[] = [
    { id: 1, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 2, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 3, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 4, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 5, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 6, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 7, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
    { id: 8, plate: 'XME-881-O', status: 'Activo', model: 'Chevrolet Beat', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', capacity: 5, year: 2021, transmission: 'Manual' },
  ];
}
