import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewVehicle, Vehicle } from '../../../core/interfaces/vehicle';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BookingResponse } from '../../../core/interfaces/booking';
import { FuelRecord, FuelRecordResponse } from '../../../core/interfaces/fuel_records';

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/v1/vehicles'
  private apiRecord = 'http://localhost:8080/api/v1/fuel-records'

  vehicleAddedSource = new Subject<void>();
  vehicleAdded$ = this.vehicleAddedSource.asObservable();

  selectedVehicleSource = new BehaviorSubject<any>(null);
  selectedVehicle$ = this.selectedVehicleSource.asObservable();

  /*
  Método para retornar una lista de
  vehículos con todos los atributos
  */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/get-all`);
  }

  addVehicle(vehicle: NewVehicle): Observable<NewVehicle> {
    return this.http.post<NewVehicle>(`${this.apiUrl}/new-vehicle`, vehicle);
  }

  notifyVehicleAdded() {
    this.vehicleAddedSource.next();
  }

  setSelectedVehicle(vehicle: any) {
    this.selectedVehicleSource.next(vehicle);
  }

  // peticiones pa la gasolina
  createFuelRecord(fuelrecord: FuelRecord): Observable<FuelRecord> {
    return this.http.post<FuelRecord>(`${this.apiRecord}`, fuelrecord);
  }

  getRecordsByVehicleId(vehicle_id: number): Observable<FuelRecordResponse[]> {
    return this.http.get<FuelRecordResponse[]>(`${this.apiRecord}/vehicle/${vehicle_id}`);
  }
}
