import { Component, OnInit } from '@angular/core';
import { VehicleApiService } from '../../services/vehicle-api.service';
import { Vehicle } from '../../../../core/interfaces/vehicle';

@Component({
  selector: 'app-vehiclecard',
  standalone: true,
  imports: [],
  templateUrl: './vehiclecard.component.html',
})
export class VehiclecardComponent implements OnInit {

  vehicles!: Vehicle[];
  constructor(private vs: VehicleApiService) { }

  ngOnInit(): void {
    this.vs.getVehicles().subscribe((data) => {
      this.vehicles = data;
    });
  }

}
