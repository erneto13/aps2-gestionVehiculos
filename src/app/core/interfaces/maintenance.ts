export interface MaintenanceResponse {
    id?: number;
    vehicleId: number;
    maintenanceType: string;
    maintenanceProblemType: string;
    description: string;
    cost: number;
    kilometers: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    mechanic: string;
    created_at?: string;
    updated_at?: string;
}

export interface Maintenance {
    vehicleId: number;
    maintenanceType: string;
    maintenanceProblemType: string;
    description: string;
    cost: number;
    kilometers: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    mechanic: string;
    created_at: string;
    updated_at: string;
}