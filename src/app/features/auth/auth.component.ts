import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px); /* subtract header height */
      padding: 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2.5rem;
    }
    .auth-title {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .toggle-text {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }
    .toggle-link {
        color: var(--accent-primary);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
    }
    .toggle-link:hover {
        color: var(--accent-primary-hover);
        text-decoration: underline;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      text-align: center;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      display: block;
    }
  `]
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Use a signal to toggle between login and register modes
  isLoginMode = signal<boolean>(true);
  errorMessage = signal<string>('');

  authForm: FormGroup = this.fb.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLoginMode.update(mode => !mode);
    this.errorMessage.set('');
    this.authForm.reset();

    const usernameControl = this.authForm.get('username');
    if (this.isLoginMode()) {
      usernameControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required]);
    }
    usernameControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const credentials = this.authForm.value;
    const auth$ = this.isLoginMode()
      ? this.authService.login(credentials)
      : this.authService.register(credentials);

    auth$.subscribe({
      next: () => {
        if (this.isLoginMode()) {
          this.router.navigate(['/feed']);
        } else {
          this.router.navigate(['/onboarding']);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Authentication failed. Please try again.');
      }
    });
  }
}
