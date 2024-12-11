// Bodriular
import { Component } from '@angular/core';

// Core
import { TrackingMapComponent } from '../../components/tracking-map/tracking-map.component';
import { FleetTrackingComponent } from '../../components/fleet-tracking/fleet-tracking.component';
import { PlacesService } from '../../../../bookings/maps/services';

@Component({
    selector: 'app-tracking-screen',
    standalone: true,
    imports: [TrackingMapComponent, FleetTrackingComponent],
    templateUrl: './tracking-screen.component.html',
})
export class TrackingScreenComponent {
    constructor(private placesService: PlacesService) { }

    get isUserLocationReady() {
        return this.placesService.isUserLocationReady
    }
}
