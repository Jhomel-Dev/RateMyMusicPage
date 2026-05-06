import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of, Observable, timeout } from 'rxjs';
import { Track } from '../interfaces/track.interface';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private readonly loadingSignal = signal<boolean>(false);
    private readonly tracksSignal = signal<Track[]>([]);
    private readonly feedSignal = signal<Track[]>([]);
    private readonly seenTrackIdsSignal = signal<string[]>([]);

    readonly isLoading = computed(() => this.loadingSignal());
    readonly tracks = computed(() => this.tracksSignal());
    readonly feed = computed(() => this.feedSignal());

    loadFeed() {
        if (this.loadingSignal()) return;

        this.loadingSignal.set(true);
        const params = { excludeIds: this.seenTrackIdsSignal().join(',') };
        
        this.http.get<Track[]>(`${this.apiUrl}/tracks/feed`, { params })
            .pipe(
                timeout(5000), // Prevent infinite hanging if backend is deadlocked
                catchError(() => of([]))
            )
            .subscribe(newTracks => this.handleFeedUpdate(newTracks));
    }

    private handleFeedUpdate(newTracks: Track[]) {
        if (!Array.isArray(newTracks)) {
            console.error('Invalid feed response:', newTracks);
            newTracks = [];
        }

        const currentIds = new Set(this.feedSignal().map(t => t.id));
        const uniqueTracks = newTracks.filter(t => !currentIds.has(t.id));

        this.feedSignal.update(current => [...current, ...uniqueTracks]);
        this.seenTrackIdsSignal.update(current => [...current, ...uniqueTracks.map(t => t.id)]);
        this.loadingSignal.set(false);
    }

    loadTracks() {
        this.loadingSignal.set(true);
        this.http.get<Track[]>(`${this.apiUrl}/tracks`)
            .pipe(catchError(() => of([])))
            .subscribe(tracks => {
                this.tracksSignal.set(tracks);
                this.loadingSignal.set(false);
            });
    }

    getMyUploads(): Observable<Track[]> {
        return this.http.get<Track[]>(`${this.apiUrl}/tracks/me/uploads`);
    }

    getRankings(genre: string): Observable<Track[]> {
        return this.http.get<Track[]>(`${this.apiUrl}/tracks/rankings/${genre}`);
    }

    updateTrackInteraction(trackId: string, updates: Partial<Track>) {
        const updater = (tracks: Track[]) => tracks.map(track =>
            track.id === trackId ? { ...track, ...updates } : track
        );
        this.tracksSignal.update(updater);
        this.feedSignal.update(updater);
    }

    addTrack(newTrack: Track) {
        this.tracksSignal.update(tracks => [newTrack, ...tracks]);
        this.feedSignal.update(feed => [newTrack, ...feed]);
    }
}
