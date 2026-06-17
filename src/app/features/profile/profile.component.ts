import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TrackService } from '../../core/services/track.service';
import { ProfileResponse } from '../../core/interfaces/auth.interface';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './profile.component.html',
    styles: []
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    trackService = inject(TrackService);

    profile: ProfileResponse | null = null;
    loading = true;
    error = '';
    saving = false;

    activeTab = signal<'my-tracks' | 'voted'>('my-tracks');
    editMode = signal(false);

    editForm = {
        username: '',
        bio: '',
        avatarUrl: ''
    };

    ngOnInit() {
        this.loadProfile();
        this.trackService.loadMyUploads();
    }

    loadProfile() {
        this.loading = true;
        this.authService.getProfile().subscribe({
            next: (data) => this.handleProfileSuccess(data),
            error: () => this.handleProfileError()
        });
    }

    private handleProfileSuccess(data: ProfileResponse) {
        this.profile = data;
        this.loading = false;
        this.populateForm();
    }

    private handleProfileError() {
        this.error = 'Failed to load profile.';
        this.loading = false;
        this.profile = {
            username: this.authService.currentUser()?.username || 'Guest',
            role: this.authService.currentUser()?.role || 'Unknown'
        };
        this.populateForm();
    }

    populateForm() {
        if (!this.profile) return;
        
        this.editForm = {
            username: this.profile.username || '',
            bio: this.profile.bio || '',
            avatarUrl: this.profile.avatarUrl || ''
        };
    }

    toggleEdit() {
        if (!this.editMode()) {
            this.populateForm();
        }
        this.editMode.update(v => !v);
    }

    saveProfile() {
        this.saving = true;
        this.authService.updateProfile({
            bio: this.editForm.bio,
            avatarUrl: this.editForm.avatarUrl
        }).subscribe({
            next: () => this.handleSaveSuccess(),
            error: () => this.handleSaveError()
        });
    }

    private handleSaveSuccess() {
        this.saving = false;
        this.editMode.set(false);
        this.loadProfile();
    }

    private handleSaveError() {
        this.saving = false;
        this.error = 'Failed to update profile.';
    }

    getInitial(): string {
        const username = this.profile?.username || this.authService.currentUser()?.username;
        return username?.charAt(0).toUpperCase() || '?';
    }

    setTab(tab: 'my-tracks' | 'voted') {
        this.activeTab.set(tab);
    }

    logout() {
        this.authService.logout();
        window.location.href = '/auth';
    }
}
