// Bodriular
import { Component } from '@angular/core';

// Core
import { Vehicle } from '../../../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../../../services/vehicle-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-info.component.html',
})
export default class BasicInfoComponent {
  vehicle!: Vehicle;
  constructor(private vi: VehicleApiService) { }

  ngOnInit() {
    this.vi.selectedVehicle$.subscribe((vehicle) => {
      this.vehicle = vehicle;
    });
  }
}
