import { Router } from "@angular/router";
import VehiclesgridComponent from "./shared/vehicles-grid/vehiclesgrid.component";
import { VehiclesheaderComponent } from "./shared/vehicles-header/vehiclesheader.component";
import { VehiclesstatisticComponent } from "./shared/vehicles-statistic/vehiclesstatistic.component";
import { Component } from "@angular/core";
import { VehicleApiService } from "./services/vehicle-api.service";

@Component({
    selector: 'vgwc-vehicles-grid-view',
    standalone: true,
    imports: [
        VehiclesheaderComponent,
        VehiclesstatisticComponent,
        VehiclesgridComponent
    ],
    template: `
        <app-vehiclesheader></app-vehiclesheader>
        <app-vehiclesstatistic></app-vehiclesstatistic>
        <app-vehiclesgrid (cardClick)="onCardClick($event)"></app-vehiclesgrid>
    `
})
export default class VehiclesGridViewComponent {
    constructor(private router: Router, private vi: VehicleApiService) { }

    onCardClick(vehicle: any) {
        this.vi.setSelectedVehicle(vehicle);
        this.router.navigate(['/vehiculos/detalles', vehicle.license_plate]);
    }
}