import { Contacts } from "./contacts";
import { Drivers } from "./drivers";
import { Vehicle } from "./vehicle";

export interface BookingResponse {
    bookings_id: number,
    vehicle: Vehicle,
    driver: Drivers,
    contact: Contacts,
    start_date: string,
    end_date: string,
    status: string,
    purpose: string,
    origin_location: string,
    destination_location: string,
    created_at: string,
    updated_at: string,
    notes: string;
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
}

export interface Booking {
    vehicle_id: number,
    driverId: number,
    contact_id: number,
    start_date: string,
    end_date: string,
    status: string,
    purpose: string,
    destination_location: string,
    created_at: string,
    updated_at: string,
    notes: string;
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
}

export interface RouteDetails {
    id: string;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    estimatedArrivalTime?: string;
    status: string;
    route: {
        origin: string;
        destination: string;
    };
}