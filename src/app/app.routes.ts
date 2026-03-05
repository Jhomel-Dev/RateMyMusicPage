import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { TrackListComponent } from './features/track-list/track-list.component';
import { UploadComponent } from './features/upload/upload.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthComponent } from './features/auth/auth.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { IncompleteProfileComponent } from './features/incomplete-profile/incomplete-profile.component';
import { LandingComponent } from './features/landing/landing.component';
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
    { path: '', component: LandingComponent, canActivate: [guestGuard] },
    { path: 'feed', component: TrackListComponent, canActivate: [authGuard, profileCompleteGuard] },
    { path: 'upload', component: UploadComponent, canActivate: [authGuard, profileCompleteGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard, profileCompleteGuard] },
    { path: 'onboarding', component: OnboardingComponent, canActivate: [authGuard] },
    { path: 'incomplete-profile', component: IncompleteProfileComponent, canActivate: [authGuard] },
    { path: 'auth', component: AuthComponent, canActivate: [guestGuard] },
    { path: '**', redirectTo: '' }
];
