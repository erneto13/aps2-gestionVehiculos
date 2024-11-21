export interface Vehicle {
    id: number,
    make: string,
    model: string,
    licensePlate: string,
    status: string,
    type_vehicle: string,
    imageUrl: string,
    createdAt: string,
    updatedAt: string
}

export interface NewVehicle {
    licensePlate: string,
    make: string,
    model: string,
    status: string,
    type_vehicle: string,
    imageUrl: string,
    createdAt: string,
    updatedAt: string
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