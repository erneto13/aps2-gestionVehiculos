import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../../core/interfaces/vehicle';

import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-vehiclecard',
  standalone: true,
  imports: [TagModule],
  templateUrl: './vehiclecard.component.html',
})
export class VehiclecardComponent {
  @Input() vehicle!: any;
}
