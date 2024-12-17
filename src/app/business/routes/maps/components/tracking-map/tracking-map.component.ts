import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Map, Marker, LngLat, LngLatBounds, AnySourceData } from 'mapbox-gl';

// Core
import { MapService } from '../../../../bookings/maps/services';
import { interval, Subscription } from 'rxjs';
import { RouteTrackingService } from '../../../services/route-tracking.service';
import { RoutePoint } from '../../../../../core/interfaces/geofence';
import { DirectionsApiClient } from '../../../../bookings/maps/api/directionsApiClient';
import { DirectionsResponse } from '../../../../../core/interfaces/directions';
import { Auth } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-tracking-map',
  standalone: true,
  imports: [],
  templateUrl: './tracking-map.component.html',
})
export class TrackingMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  private map!: Map;
  private marker!: Marker;

  private locationSubscription: Subscription | null = null;
  private pollingSubscription: Subscription | null = null;
  private routeStartSubscription: Subscription | null = null;
  private adminTrackingSubscription: Subscription | null = null;

  // Propiedades para la ruta
  private routeCoordinates: number[][] = [];
  private sourceId = 'route-source';
  private layerId = 'route-layer';
  private initialRouteCoordinates: number[][] = [];

  public routeDistance: number | null = null;
  public routeDuration: number | null = null;
  private destinationCoordinate: [number, number] | null = null;
  private isRouteCompleted: boolean = false;
  private currentPosition: [number, number] | null = null;

  private currentMarker: Marker | null = null;
  private intervalId: any;
  private currentBookingId: number | null = null;

  constructor(
    private mapService: MapService,
    private routeService: RouteTrackingService,
    private directionsApi: DirectionsApiClient,
  ) { }

  ngOnInit(): void {
    this.routeService.location$.subscribe((coords) => {
      const { latitude, longitude } = coords;

      this.addMarker(latitude, longitude);
    });

    this.routeStartSubscription = this.routeService.startRoute$.subscribe((data) => {
      if (data) {
        const { originLat, originLng, destinationLat, destinationLng, bookingId } = data;

        this.destinationCoordinate = [destinationLng, destinationLat];
        this.fetchRoute(
          [originLng, originLat],
          [destinationLng, destinationLat]
        );

        this.startPolling(bookingId);
        this.isRouteCompleted = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-108.97970721507629, 25.8148145656988],
      zoom: 14,
    });

    this.map.on('load', () => {
      this.map.resize();
      this.initializeRouteLayer();
    });

    this.locationSubscription = this.routeService.currentLocation$.subscribe((point) => {
      if (point) {
        this.updateMap(point);
      }
    });
  }

  private fetchRoute(origin: [number, number], destination: [number, number]): void {
    this.directionsApi
      .get<DirectionsResponse>(`/${origin.join(',')};${destination.join(',')}`)
      .subscribe(response => {
        const firstRoute = response.routes[0];
        if (firstRoute) {
          this.initialRouteCoordinates = firstRoute.geometry.coordinates;
          this.routeCoordinates = [...this.initialRouteCoordinates];

          this.drawRoute(this.initialRouteCoordinates);
        }
      });
  }

  startAdminTracking(bookingId: number): void {
    this.stopAdminTracking();

    this.currentBookingId = bookingId;

    this.adminTrackingSubscription = interval(5000).subscribe(() => {
      if (this.currentBookingId) {
        this.routeService.getCurrentLocation(this.currentBookingId).subscribe({
          next: (point: RoutePoint) => {
            this.updateMap(point);
          },
          error: (err) => {
            console.error('Error obteniendo punto de ruta:', err);
            this.stopAdminTracking();
          },
        });
      }
    });
  }

  stopAdminTracking(): void {
    if (this.adminTrackingSubscription) {
      this.adminTrackingSubscription.unsubscribe();
      this.adminTrackingSubscription = null;
    }
    this.currentBookingId = null;
  }

  addMarker(latitude: number, longitude: number) {
    if (this.currentMarker) {
      this.currentMarker.remove();
    }

    this.currentMarker = new Marker()
      .setLngLat([longitude, latitude])
      .addTo(this.map);
  }

  private initializeRouteLayer(): void {
    this.map.addSource(this.sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    });

    this.map.addLayer({
      id: this.layerId,
      type: 'line',
      source: this.sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });
  }

  private drawRoute(coordinates: number[][]): void {
    (this.map.getSource(this.sourceId) as mapboxgl.GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    });

    const bounds = new LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord as [number, number]));
    this.map.fitBounds(bounds, { padding: 50 });
  }

  startPolling(bookingId: number): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    this.pollingSubscription = interval(5000).subscribe(() => {
      if (!this.isRouteCompleted) {
        this.routeService.getCurrentLocation(bookingId).subscribe({
          next: (point: RoutePoint) => {
            this.routeService.updateCurrentLocation(point);
          },
          error: (err) => {
            console.error('Error obteniendo punto de ruta:', err);
          },
        });
      }
    });
  }

  updateMap(point: RoutePoint): void {
    const newCoordinate: [number, number] = [point.longitude, point.latitude];
    this.currentPosition = newCoordinate;

    // crear un marcador personalizado con imagen de auto
    if (!this.marker) {
      const carMarkerElement = document.createElement('div');
      carMarkerElement.style.backgroundImage = 'url(./assets/test.png)';
      carMarkerElement.style.width = '40px';
      carMarkerElement.style.height = '40px';
      carMarkerElement.style.backgroundSize = 'cover';

      this.marker = new Marker({ element: carMarkerElement })
        .setLngLat(newCoordinate)
        .addTo(this.map);
    } else {
      this.marker.setLngLat(newCoordinate);
    }

    // eliminar puntos de la ruta ya recorridos
    this.routeCoordinates = this.routeCoordinates.filter(coord => {
      const distance = this.calculateDistance(newCoordinate, coord);
      return distance > 0.09;
    });

    // actualizar la ruta
    if (this.routeCoordinates.length > 0) {
      (this.map.getSource(this.sourceId) as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this.routeCoordinates
        }
      });
    } else {
      // si no quedan más coordenadas eliminar la ruta
      (this.map.getSource(this.sourceId) as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }

    this.map.flyTo({ center: newCoordinate, zoom: 14 });

    // verificar si se ha llegado al destino
    if (this.destinationCoordinate) {
      const distanceToDestination = this.calculateDistance(newCoordinate, this.destinationCoordinate);
      if (distanceToDestination < 0.01) {
        this.isRouteCompleted = true;

        if (this.pollingSubscription) {
          this.pollingSubscription.unsubscribe();
        }

        (this.map.getSource(this.sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });

        console.log('Ruta completada');
      }
    }
  }

  private calculateDistance(coord1: number[], coord2: number[]): number {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  ngOnDestroy(): void {
    this.locationSubscription?.unsubscribe();
    this.pollingSubscription?.unsubscribe();
    this.routeStartSubscription?.unsubscribe();
    this.adminTrackingSubscription?.unsubscribe();
  }
}