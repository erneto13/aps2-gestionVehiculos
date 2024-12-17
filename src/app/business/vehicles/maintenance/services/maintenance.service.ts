import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { MaintenanceResponse } from "../../../../core/interfaces/maintenance";

@Injectable({
    providedIn: 'root'
})

export class MaintenanceService {
    private apiUrl = 'http://localhost:8080/api/v1/maintenance';

    constructor(private http: HttpClient) { }

    getAllMaintenanceRecords(): Observable<MaintenanceResponse[]> {
        return this.http.get<MaintenanceResponse[]>(this.apiUrl);
    }

    getMaintenanceRecordsByVehicle(vehicleId: number): Observable<MaintenanceResponse[]> {
        return this.http.get<MaintenanceResponse[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    createMaintenanceRecord(maintenanceRecord: MaintenanceResponse): Observable<MaintenanceResponse> {
        return this.http.post<MaintenanceResponse>(this.apiUrl, maintenanceRecord);
    }

    updateMaintenanceStatus(id: number, status: 'PENDING' | 'COMPLETED' | 'CANCELLED'): Observable<MaintenanceResponse> {
        return this.http.patch<MaintenanceResponse>(`${this.apiUrl}/${id}/status`, null, {
            params: { status: status }
        });
    }
}