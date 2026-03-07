import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

import { User, AuthResponse, CompleteProfileData, ProfileResponse } from '../interfaces/auth.interface';

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
            const token = localStorage.getItem('jwt_token');
            if (token) {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                return {
                    userId: decoded.sub || decoded.id,
                    username: decoded.username,
                    role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                };
            }
            return null;
        } catch { return null; }
    }

    login(credentials: any) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    const userData = { userId: response.userId, username: response.username, role: response.role };
                    this.userSignal.set(userData);
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

    updateUser(partialUser: Partial<User>) {
        const currentUser = this.userSignal();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...partialUser };
            this.userSignal.set(updatedUser);
        }
    }

    logout() {
        this.tokenSignal.set(null);
        this.userSignal.set(null);
        localStorage.removeItem('jwt_token');
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    private setToken(token: string) {
        this.tokenSignal.set(token);
        localStorage.setItem('jwt_token', token);
    }
}
