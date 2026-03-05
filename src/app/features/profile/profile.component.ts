import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, ProfileResponse } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="profile-container" style="max-width: 600px; margin: 2rem auto; padding: 2rem;">
        <h1 class="page-title" style="margin-bottom: 2rem; font-size: 2.5rem; text-align: center; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">My Profile</h1>
        
        <div class="glass-panel" style="padding: 2rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 1rem;" *ngIf="profile && !loading">
            
            <div *ngIf="profile.avatarUrl; else noAvatar">
                <img [src]="profile.avatarUrl" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary);">
            </div>
            
            <ng-template #noAvatar>
                <div style="width: 120px; height: 120px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                    {{ getInitial() }}
                </div>
            </ng-template>
            
            <h2 style="margin: 0; font-size: 1.8rem; color: var(--text-primary);">{{ profile.username || 'Guest' }}</h2>
            <p style="margin: 0; color: var(--text-secondary); background: rgba(255,255,255,0.1); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.9rem;">
                Role: {{ profile.role || 'Unknown' }}
            </p>

            <p *ngIf="profile.bio" style="margin-top: 1rem; color: var(--text-secondary); text-align: center; font-style: italic; max-width: 80%;">
                "{{ profile.bio }}"
            </p>

            <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 1.5rem; padding-top: 1.5rem;">
                <p style="margin: 0; color: var(--text-secondary); text-align: center;">User ID: {{ authService.currentUser()?.userId }}</p>
            </div>
        </div>
        
        <div *ngIf="loading" style="text-align: center; color: var(--text-secondary);">
            Loading profile...
        </div>
        
        <div *ngIf="error" style="text-align: center; color: #ef4444;">
            {{ error }}
        </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    authService = inject(AuthService);
    profile: ProfileResponse | null = null;
    loading = true;
    error = '';

    ngOnInit() {
        this.authService.getProfile().subscribe({
            next: (data) => {
                this.profile = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load profile from server.';
                this.loading = false;

                // Fallback to basic details if request fails
                this.profile = {
                    username: this.authService.currentUser()?.username || 'Guest',
                    role: this.authService.currentUser()?.role || 'Unknown'
                };
            }
        });
    }

    getInitial(): string {
        const username = this.profile?.username || this.authService.currentUser()?.username;
        return username ? username.charAt(0).toUpperCase() : '?';
    }
}
