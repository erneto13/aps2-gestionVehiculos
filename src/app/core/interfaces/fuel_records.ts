export interface FuelRecord {
    cost: number,
    fuelDate: string,
    liters: number,
    notes: string,
    odometer: number,
    station: string,
    vehicleId: number
}

export interface FuelRecordResponse {
    fuelrecord_id: number,
    cost: number,
    fuel_date: string,
    liters: number,
    notes: string,
    odometer: number,
    station: string,
    vehicle_id: number
}

export enum Stations {
    PEMEX = 'PEMEX',
    OXXOGAS = 'OXXO Gas',
    TOTAL = 'Total',
    MOBIL = 'Mobil',
    SHELL = 'Shell',
    BP = 'BP',
    CHEVRON = 'Chevron',
    REPSOL = 'Repsol',
    GULF = 'Gulf',
    G500 = 'G500',
}