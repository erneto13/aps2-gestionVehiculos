import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credentials } from '../../core/interfaces/credentials';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})

export class Auth {

    private LOGIN_URL = 'http://localhost:8080/api/v1/auth/login'
    private TOKEN_KEY = 'token';

    private REFRESH_URL = 'http://localhost:8080/api/v1/auth/refresh'
    private REFRESH_TOKEN_KEY = 'refreshToken';

    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(creds: Credentials) {
        return this.http.post(this.LOGIN_URL, creds, {
            observe: 'response'
        }).pipe(map((response: HttpResponse<any>) => {
            const body = response.body;

            if (body && body.token && body.refreshToken) {
                const token = body.token.replace('Bearer ', '');
                const refreshToken = body.refreshToken;

                this.setToken(token);
                this.setRefreshToken(refreshToken);

                this.autoRefreshToken();

                return body;
            } else {
                throw new Error("Error: No se recibieron los tokens.");
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

    setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.REFRESH_TOKEN_KEY);
        } else {
            return null;
        }
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        return this.http.post<any>(this.REFRESH_URL, { refreshToken }).pipe(
            tap((response) => {
                if (response.token) {
                    this.setToken(response.token);
                    this.setRefreshToken(response.refreshToken);
                    this.autoRefreshToken();
                }
            }
            ));
    }

    autoRefreshToken(): void {
        const token = this.getToken();
        if (!token) {
            return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;

        const timeout = exp - Date.now() - (60 * 1000);

        setTimeout(() => {
            this.refreshToken().subscribe()
        }, timeout);

    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || null;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        this.router.navigate(['/login']);
    }
}