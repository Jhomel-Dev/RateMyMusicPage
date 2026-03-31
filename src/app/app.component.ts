import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  template: `
    <app-navbar *ngIf="!isFeedPage()"></app-navbar>

    <main [ngClass]="{'container mx-auto px-6 pt-28 pb-8 min-h-screen': !isLandingPage() && !isFeedPage() && !isProfilePage()}">
        <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    // Relying on Route Guards in app.routes.ts instead of forceful root redirect
  }

  isLandingPage(): boolean {
    return this.router.url === '/' || this.router.url === '/landing';
  }

  isFeedPage(): boolean {
    return this.router.url === '/feed';
  }

  isProfilePage(): boolean {
    return this.router.url === '/profile';
  }
}
