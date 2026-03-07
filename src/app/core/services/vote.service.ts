import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { VoteResponse } from '../interfaces/track.interface';
import { TrackService } from './track.service';

@Injectable({ providedIn: 'root' })
export class VoteService {
    private http = inject(HttpClient);
    private trackService = inject(TrackService);
    private apiUrl = environment.apiUrl;

    vote(trackId: string, isHot: boolean) {
        return this.http.post<VoteResponse>(`${this.apiUrl}/votes`, { trackId, isHot }).pipe(
            tap((response) => {
                this.trackService.updateTrackVote(trackId, {
                    newEloScore: response.newEloScore,
                    isHot,
                    voteId: response.voteId
                });
            })
        );
    }
}
