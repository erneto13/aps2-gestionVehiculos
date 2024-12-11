import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, BookingResponse } from '../../../core/interfaces/booking';

@Injectable({ providedIn: 'root' })

export class BookingsService {
    apiUrl = 'http://localhost:8080/api/v1/bookings';
    constructor(private http: HttpClient) { }

    // Obtener todas las reservas
    getAllBookings(): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.apiUrl}/bookings-list`);
    }

    // Obtener una reserva por ID
    getBookingById(id: number): Observable<Booking> {
        return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    }

    // Obtener reservas asignadas a un conductor
    getBookingsByDriver(driverId: number): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/driver/${driverId}`);
    }

    // Obtener reservas asignadas a un conductor
    getBookingsByDriverName(name: string): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.apiUrl}/driver/${name}`);
    }

    // Crear una nueva reserva
    createBooking(booking: Booking): Observable<Booking> {
        return this.http.post<Booking>(`${this.apiUrl}`, booking);
    }

    // Actualizar una reserva existente
    updateBooking(id: number, booking: Booking): Observable<Booking> {
        return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
    }

    // Eliminar una reserva
    deleteBooking(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // obtiene los bookings de un vehiculo
    getBookingsForVehicle(vehicleId: number): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.apiUrl}/vehicle/${vehicleId}/bookings`);
    }

    // obtiene los bookings de un vehiculo
    getOnGoingBookings(): Observable<BookingResponse[]> {
        return this.http.get<BookingResponse[]>(`${this.apiUrl}/ongoing`);
    }

    startBooking(bookings_id: number): Observable<Booking> {
        throw new Error('Method not implemented.');
    }

    getRouteDetails(id: number): Observable<BookingResponse> {
        return this.http.get<BookingResponse>(`${this.apiUrl}/route/${id}`);
    }

    updateBookingStatus(id: number, status: string): Observable<Booking> {
        return this.http.put<Booking>(`${this.apiUrl}/${id}/status`, status);
    }
}