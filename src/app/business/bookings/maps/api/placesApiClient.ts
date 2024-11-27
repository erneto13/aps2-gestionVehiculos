import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../env";

@Injectable({
    providedIn: 'root'
})

export class PlacesApiClient extends HttpClient {


    public baseUrl: string = 'https://api.mapbox.com/search/geocode/v6/forward?q='

    constructor(handler: HttpHandler) {
        super(handler);
    }

    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        }
    }) {
        url = this.baseUrl + url;

        return super.get<T>(url, {
            params: {
                country: 'mx',
                limit: 5,
                language: 'es',
                access_token: environment.apiKey,
                ...options.params
            }
        });
    }
}