import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Track } from '../interfaces/track.interface';
import { TrackService } from './track.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
    private http = inject(HttpClient);
    private trackService = inject(TrackService);
    private apiUrl = environment.apiUrl;

    uploadTrack(formData: FormData) {
        return this.http.post<Track>(`${this.apiUrl}/tracks/upload`, formData).pipe(
            tap((newTrack) => {
                this.trackService.addTrack(newTrack);
            })
        );
    }
}
