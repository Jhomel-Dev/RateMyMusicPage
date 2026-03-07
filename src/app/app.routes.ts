import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { profileCompleteGuard } from './core/guards/profile-complete.guard';

const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        return true;
    }
    return router.parseUrl('/auth');
};

const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (!authService.isAuthenticated()) {
        return true;
    }
    return router.parseUrl('/feed');
};

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing.component').then(c => c.LandingComponent), canActivate: [guestGuard] },
    { path: 'feed', loadComponent: () => import('./features/track-list/track-list.component').then(c => c.TrackListComponent), canActivate: [authGuard, profileCompleteGuard] },
    { path: 'upload', loadComponent: () => import('./features/upload/upload.component').then(c => c.UploadComponent), canActivate: [authGuard, profileCompleteGuard] },
    { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent), canActivate: [authGuard, profileCompleteGuard] },
    { path: 'onboarding', loadComponent: () => import('./features/onboarding/onboarding.component').then(c => c.OnboardingComponent), canActivate: [authGuard] },
    { path: 'incomplete-profile', loadComponent: () => import('./features/incomplete-profile/incomplete-profile.component').then(c => c.IncompleteProfileComponent), canActivate: [authGuard] },
    { path: 'auth', loadComponent: () => import('./features/auth/auth.component').then(c => c.AuthComponent), canActivate: [guestGuard] },
    { path: '**', redirectTo: '' }
];

