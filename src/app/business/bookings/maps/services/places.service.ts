import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../../../../core/interfaces/places';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapService } from './map.service';

@Injectable({ providedIn: 'root' })

export class PlacesService {
    public useLocation?: [number, number];

    public isLoadingPlaces = false;
    public places: Feature[] = [];

    get isUserLocationReady(): boolean {
        return !!this.useLocation;
    }

    constructor(private placesApi: PlacesApiClient, private mapService: MapService) {
        this.getUserLocation();
    }

    public async getUserLocation(): Promise<[number, number]> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.useLocation = [position.coords.longitude, position.coords.latitude];
                    resolve(this.useLocation);
                },
                (error) => {
                    alert('Geolocation is not available');
                    console.error(error);
                    reject();
                }
            );
        });
    }

    getPlaces(query: string = '') {
        if (query.length === 0) {
            this.places = [];
            this.isLoadingPlaces = false;
            return;
        }

        if (!this.useLocation) throw new Error('ERROR DESDE EL SERVICIO: No se pudo obtener la ubicación del usuario');
        this.isLoadingPlaces = true;

        this.placesApi.get<PlacesResponse>(query, {
            params: {
                proximity: this.useLocation.join(','),
            }
        }).
            subscribe((response) => {
                this.isLoadingPlaces = false;
                this.places = response.features;

                this.mapService.createMarkersFromPlaces(this.places, this.useLocation!);
            });
    }

    deletePlaces() {
        this.places = [];
    }
}