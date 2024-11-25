import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class PlacesService {
    userLocation?: [number, number];

    get isUserLocationAvailable(): boolean {
        return !!this.userLocation;
    }

    constructor(private http: HttpClient) {
        this.getUserLocation();
    }

    public async getUserLocation(): Promise<[number, number]> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = [position.coords.longitude, position.coords.latitude];
                    resolve(this.userLocation);
                },
                (error) => {
                    alert('Geolocation is not available');
                    console.error(error);
                    reject(error);
                }
            );
        })
    }

    getPlaces(query: string = '') {
        // TODO: query vacio
        const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&limit=5&proximity=${this.userLocation?.join('%2C')}&language=es&access_token=pk.eyJ1IjoiZXJuZXRvMTMiLCJhIjoiY20zd2I2MW10MTFueTJycHUxdXl0Y3ZzZiJ9.fUMW24vzqzc9Ul9vuXYUtA`;
        return this.http.get(url).subscribe(console.log); 
    }
}