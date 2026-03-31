import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = signal<boolean>(true);
  errorMessage = signal<string>('');

  authForm: FormGroup = this.fb.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  setMode(mode: boolean) {
    if (this.isLoginMode() === mode) return;
    this.isLoginMode.set(mode);
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
