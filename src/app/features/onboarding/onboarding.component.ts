import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private formSub?: Subscription;

  isSubmitting = false;
  previewImage: string | null = null;
  errorMessage = '';

  onboardingForm: FormGroup = this.fb.group({
    role: ['User', Validators.required],
    bio: [''],
    avatarUrl: ['']
  });

  ngOnInit() {
    const draft = localStorage.getItem('onboarding_draft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      this.onboardingForm.patchValue(parsedDraft);
      if (parsedDraft.avatarUrl) {
        this.previewImage = parsedDraft.avatarUrl;
      }
    }

    this.formSub = this.onboardingForm.valueChanges.subscribe(val => {
      localStorage.setItem('onboarding_draft', JSON.stringify(val));
    });
  }

  ngOnDestroy() {
    this.formSub?.unsubscribe();
  }

  // Handle Ctrl+V Paste naturally
  @HostListener('window:paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          this.readImageBlob(blob);
          event.preventDefault();
        }
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.readImageBlob(file);
    }
  }

  readImageBlob(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result; // Base64 Data URL
      this.onboardingForm.patchValue({ avatarUrl: this.previewImage });
    };
    reader.readAsDataURL(blob);
  }

  onUrlChange(event: any) {
    const url = event.target.value;
    // Simple check if it looks like a URL
    if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
      this.previewImage = url;
    } else {
      this.previewImage = null;
    }
  }

  triggerFileInput() {
    document.getElementById('avatarUpload')?.click();
  }

  onSubmit() {
    if (this.onboardingForm.invalid) return;
    this.isSubmitting = true;

    this.authService.completeProfile(this.onboardingForm.value).subscribe({
      next: () => {
        // Clear draft on success
        localStorage.removeItem('onboarding_draft');

        // Let's update the local user role so guards pass immediately
        this.authService.updateUser({ role: this.onboardingForm.value.role });

        // Refresh token to get updated role claims from the backend so reload won't trigger redirect
        this.authService.refreshToken().subscribe({
          next: () => this.router.navigate(['/feed']),
          error: () => this.router.navigate(['/feed'])
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error saving profile';
        this.isSubmitting = false;
      }
    });
  }
}
