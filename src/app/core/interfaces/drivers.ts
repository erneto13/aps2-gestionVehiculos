export interface Drivers {
    driver_id: number;
    name: string;
    license_number: string;
    license_category: string;
    phone: string;
    address: string;
}

export interface DriverResponse {
    name: string;
    license_number: string;
    license_category: string;
    phone: string;
    address: string;
}