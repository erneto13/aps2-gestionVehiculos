// Bodriular
import { Component } from '@angular/core';

// Core
import { PlacesService } from '../../../../bookings/maps/services';
import { LoadingComponent } from '../../../../bookings/maps/components/loading/loading.component';
import { MapViewComponent } from '../../../../bookings/maps/components/map-view/map-view.component';
import { FleetTrackingComponent } from '../../components/fleet-tracking/fleet-tracking.component';

@Component({
    selector: 'app-tracking-screen',
    standalone: true,
    imports: [LoadingComponent, MapViewComponent,
        FleetTrackingComponent
    ],
    templateUrl: './tracking-screen.component.html',
})
export class TrackingScreenComponent {
    constructor(private placesService: PlacesService) { }

    get isUserLocationReady() {
        return this.placesService.isUserLocationReady
    }
}
