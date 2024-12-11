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

    // Agregar marcador en la ubicación inicial
    new Marker({ color: 'red' })
      .setLngLat(this.placesService.useLocation!)
      .addTo(map);

    // Evento de clic en el mapa
    map.on('click', (event) => {
      const { lng, lat } = event.lngLat;

      // Agregar la nueva ubicación seleccionada al arreglo
      this.selectedLocations.push({ lng, lat });

      // Crear un marcador en el mapa
      new Marker({ color: 'blue' })
        .setLngLat([lng, lat])
        .addTo(map);

      // Mostrar la cantidad de ubicaciones seleccionadas (opcional)
      console.log('Ubicaciones seleccionadas:', this.selectedLocations);
    });

    // Establecer el mapa en el servicio
    this.mapService.setMap(map);
  }
}
