import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../services/vehicle-api.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-vehiclesgrid',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './vehiclesgrid.component.html',
})
export class VehiclesgridComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private vs: VehicleApiService) { }

  ngOnInit(): void {
    this.vs.getVehicles().subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    });
  }
}
