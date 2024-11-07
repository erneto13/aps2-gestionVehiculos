import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private spinner: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(`peticion fallida: ${error.message}`);
        return throwError((error));
        
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}