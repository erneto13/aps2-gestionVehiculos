import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewVehicle, Vehicle } from '../../../core/interfaces/vehicle';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/v1/vehicles'

  vehicleAddedSource = new Subject<void>();
  vehicleAdded$ = this.vehicleAddedSource.asObservable();

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
}
