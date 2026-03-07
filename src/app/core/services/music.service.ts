import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Track {
    id: string;
    title: string;
    artistId: string;
    genre: string;
    audioUrl: string;
    eloScore: number;
    userVote?: boolean;
}

export interface VoteResponse {
    voteId: string | null;
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
            // After loading tracks, fetch user votes to populate the userVote property
            this.http.get<any[]>(`${this.apiUrl}/votes`).pipe(
                catchError(err => {
                    console.error('Error fetching user votes', err);
                    return of([]);
                })
            ).subscribe((votes) => {
                const tracksWithVotes = tracks.map(track => {
                    const vote = votes.find(v => v.trackId === track.id);
                    return { ...track, userVote: vote ? vote.isHot : undefined };
                });
                this.tracksSignal.set(tracksWithVotes);
            });
        });
    }

    // Vote on a track (hot or not)
    vote(trackId: string, isHot: boolean) {
        return this.http.post<VoteResponse>(`${this.apiUrl}/votes`, { trackId, isHot }).pipe(
            tap((response) => {
                this.tracksSignal.update(tracks => tracks.map(track =>
                    track.id === trackId
                        ? { ...track, eloScore: response.newEloScore, userVote: response.voteId ? isHot : undefined }
                        : track
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
