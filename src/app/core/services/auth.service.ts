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

    private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt_token'));
    private readonly refreshTokenSignal = signal<string | null>(localStorage.getItem('jwt_refresh_token'));

    readonly isAuthenticated = computed(() => {
        const token = this.tokenSignal();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && Math.floor(new Date().getTime() / 1000) >= payload.exp) {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    });

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
                    this.setTokens(response.token, response.refreshToken);
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
                    this.setTokens(response.token, response.refreshToken);
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

    updateProfile(data: Partial<CompleteProfileData>): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
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
        this.refreshTokenSignal.set(null);
        this.userSignal.set(null);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_refresh_token');
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    getRefreshToken(): string | null {
        return this.refreshTokenSignal();
    }

    refreshToken(): Observable<AuthResponse> {
        const token = this.tokenSignal();
        const refreshToken = this.refreshTokenSignal();
        return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { token, refreshToken }).pipe(
            tap(response => {
                if (response.token && response.refreshToken) {
                    this.setTokens(response.token, response.refreshToken);
                    // Update user signal from new token to capture updated claims
                    try {
                        const payload = response.token.split('.')[1];
                        const decoded = JSON.parse(atob(payload));
                        const userData: User = {
                            userId: decoded.sub || decoded.id || response.userId || '',
                            username: decoded.username || response.username || '',
                            role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || response.role || 'User'
                        };
                        this.userSignal.set(userData);
                    } catch {}
                }
            })
        );
    }

    private setTokens(token: string, refreshToken: string) {
        this.tokenSignal.set(token);
        this.refreshTokenSignal.set(refreshToken);
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('jwt_refresh_token', refreshToken);
    }
}
