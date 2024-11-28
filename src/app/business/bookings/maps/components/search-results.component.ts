import { Component } from '@angular/core';
import { MapService, PlacesService } from '../services';
import { Feature } from '../../../../core/interfaces/places';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
    standalone: true,
    imports: [],
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html'
})

export class SearchResultsPlaces {
    constructor(
        private placesService: PlacesService,
        private mapService: MapService,
        private toastService: ToastService
    ) { }

    get isLoadingPlaces() {
        return this.placesService.isLoadingPlaces;
    }

    get places() {
        return this.placesService.places;
    }

    flyTo(place: Feature) {
        const [lng, lat] = place.geometry.coordinates;
        this.mapService.flyTo([lng, lat]);
    }

    getDirections(place: Feature) {
        if (!this.placesService.useLocation) {
            this.toastService.showToast(
                'Ubicación no encendida.',
                'No se logró obtener la ubicación del punto de inicio',
                'error'
            );
            return;
        }

        this.placesService.deletePlaces();

        const origin = this.placesService.useLocation;
        const destination = place.geometry.coordinates as [number, number];

        const fullAddress = place.properties.full_address;

        this.placesService.setDestination(fullAddress);

        this.mapService.getRouteBetweenPoints(origin, destination);
    }

}