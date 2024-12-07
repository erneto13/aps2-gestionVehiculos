export interface Credentials {
    email: string,
    password: string,
}

export interface CreateCredentials {
    driverId: number;
    email: string;
    password: string;
    role?: string;
}