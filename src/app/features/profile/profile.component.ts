import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProfileResponse } from '../../core/interfaces/auth.interface';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="profile-container">
        <h1 class="page-title">My Profile</h1>
        
        <div class="glass-panel profile-card" *ngIf="profile && !loading">
            
            <div *ngIf="profile.avatarUrl; else noAvatar">
                <img [src]="profile.avatarUrl" alt="Avatar" class="profile-avatar">
            </div>
            
            <ng-template #noAvatar>
                <div class="profile-avatar-placeholder">
                    {{ getInitial() }}
                </div>
            </ng-template>
            
            <h2 class="profile-username">{{ profile.username || 'Guest' }}</h2>
            <p class="profile-role">
                Role: {{ profile.role || 'Unknown' }}
            </p>

            <p *ngIf="profile.bio" class="profile-bio">
                "{{ profile.bio }}"
            </p>

            <div class="profile-footer">
                <p class="profile-id">User ID: {{ authService.currentUser()?.userId }}</p>
            </div>
        </div>
        
        <div *ngIf="loading" class="profile-loading">
            Loading profile...
        </div>
        
        <div *ngIf="error" class="profile-error">
            {{ error }}
        </div>
    </div>
  `,
    styles: [`
    .profile-container { max-width: 600px; margin: 2rem auto; padding: 2rem; }
    .page-title { margin-bottom: 2rem; font-size: 2.5rem; text-align: center; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .profile-card { padding: 2rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .profile-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary); }
    .profile-avatar-placeholder { width: 120px; height: 120px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white; }
    .profile-username { margin: 0; font-size: 1.8rem; color: var(--text-primary); }
    .profile-role { margin: 0; color: var(--text-secondary); background: rgba(255,255,255,0.1); padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.9rem; }
    .profile-bio { margin-top: 1rem; color: var(--text-secondary); text-align: center; font-style: italic; max-width: 80%; }
    .profile-footer { width: 100%; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 1.5rem; padding-top: 1.5rem; }
    .profile-id { margin: 0; color: var(--text-secondary); text-align: center; }
    .profile-loading { text-align: center; color: var(--text-secondary); }
    .profile-error { text-align: center; color: #ef4444; }
  `]
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
