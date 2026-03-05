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
    <app-navbar></app-navbar>

    <main class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
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
}
