export interface Booking {
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

export interface BookingResponse {
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