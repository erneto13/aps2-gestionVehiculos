import { Component, EventEmitter, Output } from '@angular/core';
import { SearchResultsPlaces } from './search-results.component';
import { PlacesService } from '../services';

@Component({
    standalone: true,
    imports: [SearchResultsPlaces],
    selector: 'app-search-places',
    templateUrl: 'search-places.component.html'
})

export class SearchPlacesInput {
    private debounceTimer?: NodeJS.Timeout;

    constructor(private places: PlacesService) { }

    onQueryChange(query: string = '') {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.places.getPlaces(query)
        }, 500)
    }



}