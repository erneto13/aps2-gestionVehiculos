import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Auth } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: Auth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req)
  }
}
