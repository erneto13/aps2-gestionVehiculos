import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({ providedIn: 'root' })

export class MapService {

    private map?: Map;
    get isMapReady(): boolean {
        return !!this.map;
    }

    setMap(map: Map) {
        this.map = map;
    }

    flyTo(lngLat: LngLatLike) {
        if (!this.isMapReady) throw new Error('Map not ready');
        this.map?.flyTo({
            center: lngLat,
            zoom: 14,
            essential: true
        });
    }
}