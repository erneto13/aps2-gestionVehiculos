import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Map, AnySourceData, Marker, LngLatBounds } from 'mapbox-gl';
import { BehaviorSubject } from 'rxjs';
import { Geofence } from '../../../../core/interfaces/geofence';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse } from '../../../../core/interfaces/directions';

@Component({
    selector: 'app-map-booking',
    standalone: true,
    imports: [],
    templateUrl: './map-booking.component.html',
})
export class MapBooking implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('mapBooking')
    mapBooking!: ElementRef;

    @Input() origin!: [number, number]; // Coordenadas del origen [lng, lat]
    @Input() destination!: [number, number]; // Coordenadas del destino [lng, lat]

    map!: Map;
    geofence = new BehaviorSubject<Geofence | null>(null);

    // cargamos los marcadores, luego los eliminamos cuando sea necesario
    private markers: Marker[] = [];

    constructor(private directionsApi: DirectionsApiClient) { }

    ngAfterViewInit(): void {
        this.initializeMap();
    }

    private initializeMap(): void {
        this.map = new Map({
            container: this.mapBooking.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: this.origin,
            zoom: 12,
        });

        this.map.on('load', () => {
            this.map.resize();
            this.fetchRoute();
            this.addMarkersAndFitBounds();
        });
    }

    /*
    Cuándo ya hay cambios se re-acomodan los 
    marcadores y se vuelve a trazar la ruta
    */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['origin'] || changes['destination']) {
            if (this.map) {
                // limpia los marcadores y line-string
                this.clearMarkersAndRoute();

                // traza la ruta y agrega los marcadores
                this.fetchRoute();
                this.addMarkersAndFitBounds();
            }
        }
    }

    private clearMarkersAndRoute(): void {
        // limpiamos la lista de marcadores
        this.markers.forEach(marker => marker.remove());
        this.markers = [];

        // removemos las capas de la ruta
        if (this.map.getSource('route')) {
            this.map.removeLayer('route');
            this.map.removeSource('route');
        }
    }

    fetchRoute(): void {
        this.directionsApi
            .get<DirectionsResponse>(`/${this.origin.join(',')};${this.destination.join(',')}`)
            .subscribe(response => {
                const firstRoute = response.routes[0];
                if (firstRoute) {
                    const geoFence: Geofence = {
                        originLat: this.origin[1],
                        originLng: this.origin[0],
                        destinationLat: this.destination[1],
                        destinationLng: this.destination[0],
                    };
                    this.geofence.next(geoFence);
                    this.drawLineString(firstRoute);
                } else {
                    // TODO: manejar el error
                }
            });
    }

    drawLineString(route: any): void {
        const coordinates = route.geometry.coordinates;

        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates,
                        },
                    },
                ],
            },
        };

        this.map.addSource('route', sourceData);

        this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': 'black',
                'line-width': 3,
            },
        });
    }

    addMarkersAndFitBounds(): void {
        const bounds = new LngLatBounds();
        bounds.extend(this.origin);
        bounds.extend(this.destination);

        // creamos y almacenamos el marcador de origen y desitno
        const originMarker = new Marker({ color: 'red' })
            .setLngLat(this.origin)
            .addTo(this.map);
        this.markers.push(originMarker);

        const destinationMarker = new Marker({ color: 'green' })
            .setLngLat(this.destination)
            .addTo(this.map);
        this.markers.push(destinationMarker);

        // ajustamos el mapa entre los 2 puntos *el padding es para que si
        // hay un marcador en los bordes estos se vean completos
        this.map.fitBounds(bounds, { padding: 60 });
    }

    // limpiamos el mapa y eliminamos el mapa
    ngOnDestroy(): void {
        if (this.map) {
            this.clearMarkersAndRoute();
            this.map.remove();
        }
    }
}