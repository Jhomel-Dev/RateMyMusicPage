import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadService } from '../../core/services/upload.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="upload-container">
        <h1 class="page-title">Upload Track</h1>
        
        <div class="glass-panel upload-card">
            <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
                
                <div class="form-group">
                    <label for="title" class="form-label">Track Title</label>
                    <input id="title" type="text" formControlName="title" class="form-input" placeholder="Song Name">
                    <small class="error-text" *ngIf="uploadForm.get('title')?.invalid && (uploadForm.get('title')?.dirty || uploadForm.get('title')?.touched)">
                        Track title is required
                    </small>
                </div>

                <div class="form-group">
                    <label for="genre" class="form-label">Genre</label>
                    <select id="genre" formControlName="genre" class="form-input form-select">
                        <option value="" disabled selected>Select a genre</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Electronic">Electronic</option>
                        <option value="R&B">R&B</option>
                        <option value="Classical">Classical</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Other">Other</option>
                    </select>
                    <small class="error-text" *ngIf="uploadForm.get('genre')?.invalid && (uploadForm.get('genre')?.dirty || uploadForm.get('genre')?.touched)">
                        Please select a genre
                    </small>
                </div>

                <div class="form-group">
                    <label for="audio" class="form-label">Audio File (.mp3, .wav)</label>
                    <input id="audio" type="file" (change)="onFileSelected($event)" accept="audio/*" class="form-input file-input">
                </div>

                <button type="submit" class="btn btn-primary submit-btn" [disabled]="isUploading()">
                    {{ isUploading() ? 'Uploading...' : 'Upload Track' }}
                </button>

                <div *ngIf="errorMessage()" class="error-message">
                    {{ errorMessage() }}
                </div>
                
                <div *ngIf="successMessage()" class="success-message">
                    {{ successMessage() }}
                </div>

            </form>
        </div>
    </div>
  `,
    styles: [`
    .upload-container { max-width: 500px; margin: 2rem auto; padding: 2rem; }
    .page-title { margin-bottom: 2rem; font-size: 2.5rem; text-align: center; background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .upload-card { padding: 2rem; border-radius: 12px; }
    .form-select { appearance: auto; }
    .file-input { padding: 0.6rem; }
    .submit-btn { width: 100%; margin-top: 1rem; }
    .error-message { color: #ef4444; font-size: 0.85rem; margin-top: 1rem; text-align: center; }
    .success-message { color: #10b981; font-size: 0.85rem; margin-top: 1rem; text-align: center; }
  `]
})
export class UploadComponent {
    private fb = inject(FormBuilder);
    private uploadService = inject(UploadService);
    private router = inject(Router);

    isUploading = signal(false);
    errorMessage = signal('');
    successMessage = signal('');
    selectedFile: File | null = null;

    uploadForm: FormGroup = this.fb.group({
        title: ['', Validators.required],
        genre: ['', Validators.required]
    });

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                this.errorMessage.set('Please select a valid audio file.');
                this.selectedFile = null;
            } else {
                this.errorMessage.set('');
                this.selectedFile = file;
            }
        }
    }

    onSubmit() {
        if (this.uploadForm.invalid || !this.selectedFile) {
            this.uploadForm.markAllAsTouched();
            if (!this.selectedFile) {
                this.errorMessage.set('Please select an audio file first.');
            } else {
                this.errorMessage.set('Please fill out all required fields.');
            }
            return;
        }

        this.isUploading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        const formData = new FormData();
        formData.append('title', this.uploadForm.value.title);
        formData.append('genre', this.uploadForm.value.genre);
        formData.append('audio', this.selectedFile);

        this.uploadService.uploadTrack(formData).subscribe({
            next: () => {
                this.isUploading.set(false);
                this.successMessage.set('Track uploaded successfully!');
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 1500);
            },
            error: (err) => {
                this.isUploading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to upload track.');
            }
        });
    }
}
