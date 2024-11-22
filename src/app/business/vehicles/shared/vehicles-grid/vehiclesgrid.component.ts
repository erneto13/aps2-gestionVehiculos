import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

// Core
import { Vehicle } from '../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../services/vehicle-api.service';

@Component({
  selector: 'app-vehiclesgrid',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './vehiclesgrid.component.html',
})
export class VehiclesgridComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  vehicleAddedSubscription!: Subscription;

  constructor(private vs: VehicleApiService) { }

  ngOnInit(): void {
    this.loadVehicles();

    this.vehicleAddedSubscription = this.vs.vehicleAdded$.subscribe(() => {
      this.loadVehicles();
    });
  }

  ngOnDestroy(): void {
    if (this.vehicleAddedSubscription) {
      this.vehicleAddedSubscription.unsubscribe();
    }
  }

  loadVehicles(): void {
    this.vs.getVehicles().subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    });
  }
}
