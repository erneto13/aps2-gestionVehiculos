import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(private placesService: PlacesService, private mapService: MapService) { }

  ngAfterViewInit(): void {
    if (!this.placesService.isUserLocationReady) {
      console.error('Ubicación del usuario no está lista. No se puede inicializar el mapa.');
      return;
    }

    const map = new Map({
      container: this.mapDivElement.nativeElement, // Elemento donde se renderiza el mapa
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: this.placesService.useLocation!, // Coordenadas iniciales [longitud, latitud]
      zoom: 14 // Nivel de zoom inicial
    });

    const popup = new Popup()
      .setHTML('<h1>Hello World!</h1>')
      .addTo(map);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.useLocation!)
      .setPopup(popup)
      .addTo(map);

      this.mapService.setMap(map);
  }


}
