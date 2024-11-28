import { Component } from '@angular/core';
import { MapService, PlacesService } from '../services';
import { Feature } from '../../../../core/interfaces/places';

@Component({
    standalone: true,
    imports: [],
    selector: 'app-search-results',
    templateUrl: 'search-results.component.html'
})

export class SearchResultsPlaces {
    constructor(private placesService: PlacesService, private mapService: MapService) { }

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
        if (!this.placesService.useLocation) throw new Error('No location to get directions from');

        this.placesService.deletePlaces();

        const origin = this.placesService.useLocation;
        const destination = place.geometry.coordinates as [number, number];

        this.mapService.getRouteBetweenPoints(origin, destination);
        console.log('Getting directions from', origin, 'to', destination);
    }
}