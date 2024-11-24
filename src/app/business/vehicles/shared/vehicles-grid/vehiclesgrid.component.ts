import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

// Core
import { Vehicle } from '../../../../core/interfaces/vehicle';
import { VehicleApiService } from '../../services/vehicle-api.service';

// Components
import { VehiclesstatisticComponent } from '../vehicles-statistic/vehiclesstatistic.component';
import { VehiclesheaderComponent } from '../vehicles-header/vehiclesheader.component';

@Component({
  selector: 'app-vehiclesgrid',
  standalone: true,
  imports: [DatePipe, CommonModule, VehiclesstatisticComponent, VehiclesheaderComponent],
  templateUrl: './vehiclesgrid.component.html',
})
export default class VehiclesgridComponent implements OnInit, OnDestroy {
  @Output() cardClick = new EventEmitter<any>();
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
