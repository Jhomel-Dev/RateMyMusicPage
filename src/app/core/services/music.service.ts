import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Track {
    _id: string;
    title: string;
    artist: string;
    avgScore: number;
}

export interface VoteResponse {
    voteId: string;
    newEloScore: number;
}


@Injectable({
    providedIn: 'root'
})
export class MusicService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Private state signal
    private readonly tracksSignal = signal<Track[]>([]);

    // Public readonly state computed signal
    readonly tracks = computed(() => this.tracksSignal());

    constructor() { }

    // Fetch all tracks and update signal state
    loadTracks() {
        this.http.get<Track[]>(`${this.apiUrl}/tracks`).pipe(
            catchError(err => {
                console.error('Error fetching tracks', err);
                return of([]);
            })
        ).subscribe((tracks) => {
            this.tracksSignal.set(tracks);
        });
    }

    // Vote on a track (hot or not)
    vote(trackId: string, isHot: boolean) {
        return this.http.post<VoteResponse>(`${this.apiUrl}/votes`, { trackId, isHot }).pipe(
            tap((response) => {
                this.tracksSignal.update(tracks => tracks.map(track =>
                    track._id === trackId ? { ...track, eloScore: response.newEloScore } : track
                ));
            })
        );
    }

    // Upload a track using FormData and refresh the list
    uploadTrack(formData: FormData) {
        return this.http.post<Track>(`${this.apiUrl}/tracks/upload`, formData).pipe(
            tap((newTrack) => {
                this.tracksSignal.update(tracks => [...tracks, newTrack]);
            })
        );
    }
}
