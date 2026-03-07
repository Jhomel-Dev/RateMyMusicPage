import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Track } from '../interfaces/track.interface';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private readonly loadingSignal = signal<boolean>(true);
    private readonly tracksSignal = signal<Track[]>([]);

    readonly isLoading = computed(() => this.loadingSignal());
    readonly tracks = computed(() => this.tracksSignal());

    loadTracks() {
        this.loadingSignal.set(true);

        const tracks$ = this.http.get<Track[]>(`${this.apiUrl}/tracks`).pipe(
            catchError(err => {
                console.error('Error fetching tracks', err);
                return of([]);
            })
        );

        const votes$ = this.http.get<any[]>(`${this.apiUrl}/votes`).pipe(
            catchError(err => {
                console.error('Error fetching user votes', err);
                return of([]);
            })
        );

        forkJoin({ tracks: tracks$, votes: votes$ }).pipe(
            map(({ tracks, votes }) => {
                return tracks.map(track => {
                    const vote = votes.find((v: any) => v.trackId === track.id);
                    return { ...track, userVote: vote ? vote.isHot : undefined };
                });
            })
        ).subscribe(tracksWithVotes => {
            this.tracksSignal.set(tracksWithVotes);
            this.loadingSignal.set(false);
        });
    }

    updateTrackVote(trackId: string, info: { newEloScore: number; isHot: boolean; voteId: string | null }) {
        this.tracksSignal.update(tracks => tracks.map(track =>
            track.id === trackId
                ? { ...track, eloScore: info.newEloScore, userVote: info.voteId ? info.isHot : undefined }
                : track
        ));
    }

    addTrack(newTrack: Track) {
        this.tracksSignal.update(tracks => [...tracks, newTrack]);
    }
}
