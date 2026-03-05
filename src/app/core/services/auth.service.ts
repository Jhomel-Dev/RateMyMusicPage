import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface User {
    userId: string;
    username: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    userId: string;
    username: string;
    role: string;
}

export interface CompleteProfileData {
    role: string;
    bio?: string;
    avatarUrl?: string;
}

export interface ProfileResponse {
    username: string;
    avatarUrl?: string;
    bio?: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/auth';

    // Signals for reactive state
    private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt_token'));

    // Computed signal for easy authentication check
    readonly isAuthenticated = computed(() => !!this.tokenSignal());

    // Store user info
    private readonly userSignal = signal<User | null>(this.getStoredUser());
    readonly currentUser = this.userSignal.asReadonly();

    constructor() { }

    private getStoredUser(): User | null {
        try {
            const data = localStorage.getItem('user_data');
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    login(credentials: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    const userData = { userId: response.userId, username: response.username, role: response.role };
                    this.userSignal.set(userData);
                    localStorage.setItem('user_data', JSON.stringify(userData));
                }
            })
        );
    }

    register(userData: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    const userData = { userId: response.userId, username: response.username, role: response.role };
                    this.userSignal.set(userData);
                    localStorage.setItem('user_data', JSON.stringify(userData));
                }
            })
        );
    }

    completeProfile(data: CompleteProfileData): Observable<any> {
        return this.http.post(`${this.apiUrl}/profile`, data);
    }

    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.apiUrl}/profile`);
    }

    logout() {
        this.tokenSignal.set(null);
        this.userSignal.set(null);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    private setToken(token: string) {
        this.tokenSignal.set(token);
        localStorage.setItem('jwt_token', token);
    }
}
