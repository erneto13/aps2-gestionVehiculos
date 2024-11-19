import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../../core/interfaces/vehicle';

@Component({
  selector: 'app-vehiclesgrid',
  standalone: true,
  imports: [],
  templateUrl: './vehiclesgrid.component.html',
})
export class VehiclesgridComponent {
  @Input() vehicles: Vehicle[] = [];

}
