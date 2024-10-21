import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '../../core/interfaces/credentials';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class Auth {

    private LOGIN_URL = 'http://localhost:8080/api/v1/auth/login'
    private TOKEN_KEY = 'token';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(creds: Credentials) {
        return this.http.post(this.LOGIN_URL, creds, {
            observe: 'response'
        }).pipe(map((response: HttpResponse<any>) => {
            const body = response.body;

            if (body && body.token) {
                const token = body.token.replace('Bearer ', '');
                localStorage.setItem(this.TOKEN_KEY, token);
                return body;
            } else {
                throw new Error("los zetas estan afuera atte: el chapo");
            }
        }));
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.TOKEN_KEY);
        } else {
            return null;
        }
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        console.log(exp)
        return Date.now() < exp;
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigate(['/login']);
    }
}