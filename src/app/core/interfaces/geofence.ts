export interface Geofence {
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number,
}

export interface RoutePoint {
    latitude: number;
    longitude: number;
}

export interface RouteStartData {
    bookingId: number;
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number,
}