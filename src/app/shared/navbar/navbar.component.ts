import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .brand {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .user-greeting {
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .icon {
      color: var(--accent-primary);
    }
  `]
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
