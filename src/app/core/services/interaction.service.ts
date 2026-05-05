import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { VoteResponse, FavoriteToggleResponse, VoteType, Vote } from '../interfaces/track.interface';
import { TrackService } from './track.service';

@Injectable({ providedIn: 'root' })
export class InteractionService {
    private http = inject(HttpClient);
    private trackService = inject(TrackService);
    private apiUrl = environment.apiUrl;

    vote(trackId: string, voteType: VoteType) {
        return this.http.post<VoteResponse>(`${this.apiUrl}/votes`, { trackId, voteType }).pipe(
            tap(response => this.trackService.updateTrackInteraction(trackId, {
                score: response.newScore,
                votesCount: response.newVotesCount,
                userVote: voteType
            })),
            catchError(err => {
                console.error('Vote failed', err);
                throw err;
            })
        );
    }

    toggleFavorite(trackId: string) {
        return this.http.post<FavoriteToggleResponse>(`${this.apiUrl}/favorites/${trackId}/toggle`, {}).pipe(
            tap(response => this.trackService.updateTrackInteraction(trackId, {
                isFavorite: response.isFavorite
            }))
        );
    }

    getVoteHistory(): Observable<Vote[]> {
        return this.http.get<Vote[]>(`${this.apiUrl}/votes`).pipe(
            catchError(() => of([]))
        );
    }

    getFavorites(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/favorites/me`).pipe(
            catchError(() => of([]))
        );
    }
}
