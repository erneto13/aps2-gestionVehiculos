import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RoutePoint, RouteStartData } from '../../../core/interfaces/geofence';


@Injectable({
  providedIn: 'root'
})
export class RouteTrackingService {

  private apiUrl = 'https://sgfa-backend-latest.onrender.com/api/v1/routes';
  private currentLocationSubject = new BehaviorSubject<RoutePoint | null>(null);

  private startRouteSource = new BehaviorSubject<RouteStartData | null>(null);

  private locationSource = new Subject<{ latitude: number; longitude: number }>();
  location$ = this.locationSource.asObservable();

  constructor(private http: HttpClient) { }

  currentLocation$: Observable<RoutePoint | null> = this.currentLocationSubject.asObservable();
  startRoute$ = this.startRouteSource.asObservable();

  startRoute(bookingId: number, routeCoordinates: [number, number][]): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/start/${bookingId}`,
      routeCoordinates,
      { responseType: 'text' as 'json' }
    );
  }

  getCurrentLocation(bookingId: number): Observable<RoutePoint> {
    return this.http.get<RoutePoint>(`${this.apiUrl}/current-location/${bookingId}`);
  }

  updateCurrentLocation(location: RoutePoint): void {
    this.currentLocationSubject.next(location);
  }

  triggerStartRoute(data: RouteStartData): void {
    this.startRouteSource.next(data);
  }

  sendLocation(latitude: number, longitude: number) {
    this.locationSource.next({ latitude, longitude });
  }
}
