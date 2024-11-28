import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../../../../core/interfaces/places';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../../../../core/interfaces/directions';

@Injectable({ providedIn: 'root' })

export class MapService {

    private map?: Map;
    private markers: Marker[] = [];

    get isMapReady(): boolean {
        return !!this.map;
    }

    constructor(private directionsApi: DirectionsApiClient) { }

    setMap(map: Map) {
        this.map = map;
    }

    flyTo(lngLat: LngLatLike) {
        if (!this.isMapReady) throw new Error('Map not ready');
        this.map?.flyTo({
            center: lngLat,
            zoom: 14,
        });
    }

    createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
        if (!this.map) throw new Error('Map not ready');

        this.markers.forEach(marker => marker.remove());
        const newMarkers = [];

        for (const place of places) {
            const [lng, lat] = place.geometry.coordinates;
            const popup = new Popup()
                .setHTML(`
                    <h3>${place.properties.name}</h3>
                    <p>${place.properties.full_address}</p>
                    `);

            const newMarker = new Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(this.map);

            newMarkers.push(newMarker);
        }
        this.markers = newMarkers;

        if (places.length === 0) return;

        // Zoom inicial para los límites del mapa
        const bounds = new LngLatBounds();
        newMarkers.forEach(market => bounds.extend(market.getLngLat()));
        bounds.extend(userLocation);

        this.map.fitBounds(bounds, {
            padding: 120,
        });
    }

    getRouteBetweenPoints(origin: [number, number], destination: [number, number]) {
        // Eliminar todos los marcadores excepto el de origen y destino
        this.markers = this.markers.filter(marker => {
            const markerCoords = marker.getLngLat();
            const isOriginOrDestination =
                (markerCoords.lng === origin[0] && markerCoords.lat === origin[1]) ||
                (markerCoords.lng === destination[0] && markerCoords.lat === destination[1]);

            if (!isOriginOrDestination) {
                marker.remove();
            }
            return isOriginOrDestination;
        });

        this.directionsApi.get<DirectionsResponse>(`/${origin.join(',')};${destination.join(',')}`)
            .subscribe(response => {
                this.drawLineString(response.routes[0]);
            });
    }

    private drawLineString(route: Route) {
        if (!this.map) throw new Error('Map not ready');

        const coords = route.geometry.coordinates;

        const bounds = new LngLatBounds();
        coords.forEach(([lng, lat]) => {
            bounds.extend([lng, lat]);
        });
        this.map?.fitBounds(bounds, {
            padding: 120,
        })

        // polyline
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
                            coordinates: coords
                        }
                    }
                ]
            }
        }

        // TODO: limpiar line string previa
        if (this.map.getLayer('RouteString')) {
            this.map.removeLayer('RouteString');
            this.map.removeSource('RouteString');
        }


        this.map.addSource('RouteString', sourceData)
        this.map.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        });
    }
}