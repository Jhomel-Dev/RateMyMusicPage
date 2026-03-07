import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Bind to the signal
  isAuthenticated = this.authService.isAuthenticated;

  isNavHidden(): boolean {
    const hiddenRoutes = ['/onboarding', '/incomplete-profile'];
    return hiddenRoutes.includes(this.router.url);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
