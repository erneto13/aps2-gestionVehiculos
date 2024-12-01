import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, GeoJSONSource, AnySourceData, Marker, LngLatBounds } from 'mapbox-gl';
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
export class MapBooking implements AfterViewInit {
    @ViewChild('mapBooking')
    mapBooking!: ElementRef;

    @Input() origin!: [number, number]; // Coordenadas del origen [lng, lat]
    @Input() destination!: [number, number]; // Coordenadas del destino [lng, lat]

    map!: Map;
    geofence = new BehaviorSubject<Geofence | null>(null);

    constructor(private directionsApi: DirectionsApiClient) { } // Reemplaza con el servicio real

    ngAfterViewInit(): void {
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
                    console.error('No se encontró ninguna ruta en la respuesta.');
                }
            });
    }

    drawLineString(route: any): void {
        const coordinates = route.geometry.coordinates;

        if (this.map.getSource('route')) {
            (this.map.getSource('route') as GeoJSONSource).setData({
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates,
                },
            });
        } else {

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
                                coordinates: coordinates
                            }
                        }
                    ]
                }
            }

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
    }

    addMarkersAndFitBounds(): void {
        const bounds = new LngLatBounds();
        bounds.extend(this.origin);
        bounds.extend(this.destination);

        new Marker({ color: 'red' })
            .setLngLat(this.origin)
            .addTo(this.map);

        new Marker({ color: 'green' })
            .setLngLat(this.destination)
            .addTo(this.map);

        this.map.fitBounds(bounds, { padding: 50 });
    }

}
