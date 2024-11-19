import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from '../../../core/interfaces/vehicle';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleApiService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/v1/vehicles'

  /*
  Método para retornar una lista de
  vehículos con todos los atributos
  */
  getVehicles(): Observable<Vehicle[]> { 
    return this.http.get<Vehicle[]>(`${this.apiUrl}/get-all`);
  }
}
