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
    <div class="max-w-xl mx-auto my-8 p-8">
        <h1 class="mb-8 text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">Upload Track</h1>
        
        <div class="p-8 rounded-2xl bg-surface/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
                
                <div class="flex flex-col gap-2">
                    <label for="title" class="text-sm font-medium text-slate-300">Track Title</label>
                    <input id="title" type="text" formControlName="title" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder-slate-500" placeholder="Song Name">
                    <small class="text-red-400 text-sm mt-1" *ngIf="uploadForm.get('title')?.invalid && (uploadForm.get('title')?.dirty || uploadForm.get('title')?.touched)">
                        Track title is required
                    </small>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="genre" class="text-sm font-medium text-slate-300">Genre</label>
                    <select id="genre" formControlName="genre" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white">
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
                    <small class="text-red-400 text-sm mt-1" *ngIf="uploadForm.get('genre')?.invalid && (uploadForm.get('genre')?.dirty || uploadForm.get('genre')?.touched)">
                        Please select a genre
                    </small>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="audio" class="text-sm font-medium text-slate-300">Audio File (.mp3, .wav)</label>
                    <input id="audio" type="file" (change)="onFileSelected($event)" accept="audio/*" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-surface hover:file:bg-primary/90">
                </div>

                <button type="submit" class="w-full mt-4 py-3.5 px-4 bg-primary text-surface font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed" [disabled]="isUploading()">
                    {{ isUploading() ? 'Uploading...' : 'Upload Track' }}
                </button>

                <div *ngIf="errorMessage()" class="text-red-400 text-sm text-center mt-2 p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                    {{ errorMessage() }}
                </div>
                
                <div *ngIf="successMessage()" class="text-green-400 text-sm text-center mt-2 p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                    {{ successMessage() }}
                </div>

            </form>
        </div>
    </div>
  `,
    styles: []
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
