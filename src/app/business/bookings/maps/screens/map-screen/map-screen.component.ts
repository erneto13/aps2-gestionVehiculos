import { Component } from '@angular/core';
import { PlacesService } from '../../services';
import { LoadingComponent } from '../../components/loading/loading.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';

@Component({
  selector: 'app-map-screen',
  standalone: true,
  imports: [LoadingComponent, MapViewComponent],
  templateUrl: './map-screen.component.html',
  styleUrl: './map-screen.component.css'
})
export class MapScreenComponent {
  constructor(private placesService: PlacesService) { }

  get isUserLocationReady() {
    return this.placesService.isUserLocationReady
  }
}