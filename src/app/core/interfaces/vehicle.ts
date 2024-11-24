export interface Vehicle {
    vehicle_id: number,
    license_plate: string,
    brand: string,
    model: string,
    year: string,
    color: string,
    transmission_type: string,
    fuel_type: string,
    engine_type: string,
    type: string,
    status: string,
    registration_date: string
    image_url: string,
}

export interface NewVehicle {
    license_plate: string,
    brand: string,
    model: string,
    year: string,
    color: string,
    transmission_type: string,
    fuel_type: string,
    engine_type: string,
    type: string,
    status: string,
    registration_date: string
    image_url: string,
}

export enum VehiclesType {
    Urbano = 'Urbano',
    Sedan = 'Sedan',
    Coupe = 'Coupe',
    Monovolumen = 'Monovolumen',
    Suv = 'Suv',
    TodoTerreno = 'TodoTerreno',
    Pickup = 'Pickup',
    Camion = 'Camión'
}

export enum TransmissionType {
    Manual = 'Manual',
    Automatic = 'Automatic',
    SemiAutomatic = 'SemiAutomatic',
    CVT = 'CVT'
}

export enum FuelType {
    Gasoline = 'Gasoline',
    Diesel = 'Diesel',
    Electric = 'Electric',
    Hybrid = 'Hybrid'
}

export enum Status {
    Active = 'Active',
    UnderMaintenance = 'Under Maintenance',
    Retired = 'Retired'
}