import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incomplete-profile',
  standalone: true,
  imports: [],
  templateUrl: './incomplete-profile.component.html',
  styleUrl: './incomplete-profile.component.css'
})
export class IncompleteProfileComponent {
  private router = inject(Router);

  goToOnboarding() {
    this.router.navigate(['/onboarding']);
  }
}
