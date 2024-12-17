import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Marker } from 'mapbox-gl';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;

  // Para almacenar las ubicaciones seleccionadas
  selectedLocations: { lng: number, lat: number }[] = [];

  constructor(
    private placesService: PlacesService,
    private mapService: MapService,
    private toastService: ToastService
  ) { }

  ngAfterViewInit(): void {
    if (!this.placesService.isUserLocationReady) {
      this.toastService.showToast(
        'Ubicación no encendida.',
        'No se logró obtener la ubicación del punto de inicio.',
        'error'
      );
      return;
    }

    const map = new Map({
      container: this.mapDivElement.nativeElement, // Elemento donde se renderiza el mapa
      style: 'mapbox://styles/mapbox/streets-v12', // Estilo del mapa
      center: this.placesService.useLocation! || [1, 1], // Coordenadas iniciales [longitud, latitud]
      zoom: 14 // Nivel de zoom inicial
    });

    map.on('load', function () {
      map.resize();
    });

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.useLocation!)
      .addTo(map);

    map.on('click', (event) => {
      const { lng, lat } = event.lngLat;

      this.selectedLocations.push({ lng, lat });

      new Marker({ color: 'blue' })
        .setLngLat([lng, lat])
        .addTo(map);

    });

    this.mapService.setMap(map);
  }
}
