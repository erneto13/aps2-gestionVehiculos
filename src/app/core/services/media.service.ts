import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private readonly baseUrl = `https://sgfa-backend-latest.onrender.com/api/v1/media`;
  constructor(private http: HttpClient) { }

  // sube un solo archivo
  uploadSingleFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  // sube muchas imagenes pero ya me da weba cambiarlo
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-files`, formData);
  }

  loadImages(filenames: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/load-images`, { filenames });
  }

  getFile(filename: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${filename}`);
  }
}
