import { Component } from '@angular/core';
import { PlacesService } from '../../services';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { SearchPlacesInput } from '../../components/search-places.component';

@Component({
  selector: 'app-map-screen',
  standalone: true,
  imports: [LoadingComponent, MapViewComponent, SearchPlacesInput],
  templateUrl: './map-screen.component.html',
})
export class MapScreenComponent {
  constructor(private placesService: PlacesService) { }

  get isUserLocationReady() {
    return this.placesService.isUserLocationReady
  }
}
