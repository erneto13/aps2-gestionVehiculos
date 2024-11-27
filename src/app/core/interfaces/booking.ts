export interface BookingResponse {
    bookings_id: number,
    vehicle_id: number,
    driver_id: number,
    start_date: string,
    end_date: string,
    status: string,
    purpose: string,
    origin_location: string,
    destination_location: string,
    created_at: string,
    updated_at: string,
}

export interface Booking {
    vehicle_id: number,
    driver_id: number,
    start_date: string,
    end_date: string,
    status: string,
    purpose: string,
    origin_location: string,
    destination_location: string,
    created_at: string,
    updated_at: string,
    notes: string;
}