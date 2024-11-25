import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DriverResponse, Drivers } from '../../../core/interfaces/drivers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  api = 'http://localhost:8080/api/v1/drivers';

  constructor(private http: HttpClient) { }

  getDrivers(): Observable<Drivers[]> {
    return this.http.get<Drivers[]>(`${this.api}/drivers-list`);
  }

  addDriver(driver: DriverResponse): Observable<DriverResponse> {
    return this.http.post<DriverResponse>(this.api, driver);
  }

  updateDriver(driver: Drivers): Observable<Drivers> {
    console.log(`Sending PUT request to ${this.api}/${driver.driver_id}`, driver);
    return this.http.put<Drivers>(`${this.api}/${driver.driver_id}`, driver);
  }


  deleteDriver(id: number): Observable<string> {
    return this.http.delete<string>(`${this.api}/${id}`);
  }
}