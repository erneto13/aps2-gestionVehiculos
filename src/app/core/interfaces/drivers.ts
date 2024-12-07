export interface Drivers {
    driver_id: number;
    profile_picture: string;
    name: string;
    license_number: string;
    license_category: string;
    email: string;
    phone: string;
    address: string;
}

export interface DriverResponse {
    profile_picture: string;
    name: string;
    license_number: string;
    license_category: string;
    email: string;
    phone: string;
    address: string;
}

export interface UserDriver {
    id: number,
    userEmail: string,
    userRole: string,
    driverName: string,
    driverProfilePicture: string,
    createdAt: string
}

export interface UserDriverCredentials {
    driverId: number,
    email: string,
    password: string,
}