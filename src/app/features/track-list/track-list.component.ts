import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackService } from '../../core/services/track.service';
import { VoteService } from '../../core/services/vote.service';
import { TrackItemComponent } from './track-item/track-item.component';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TrackItemComponent],
  templateUrl: './track-list.component.html',
  styles: [`
    .page-title {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        text-align: center;
        background: var(--accent-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .track-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .add-track-card {
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .loading-container {
        text-align: center;
        margin-top: 4rem;
        color: var(--text-secondary);
    }
    .spinner-anim {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top-color: var(--accent-primary);
        animation: spin 1s ease-in-out infinite;
    }
    .loading-text {
        margin-top: 1rem;
    }
    .empty-container {
        text-align: center;
        margin-top: 4rem;
        color: var(--text-secondary);
    }
    .upload-btn-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 2rem;
        margin-top: -1rem;
    }
    @keyframes spin { 
        to { transform: rotate(360deg); } 
    }
  `]
})
export class TrackListComponent implements OnInit {
  trackService = inject(TrackService);
  voteService = inject(VoteService);

  // Public signal reference for the template
  tracks = this.trackService.tracks;

  ngOnInit() {
    this.trackService.loadTracks();
  }

  handleVote(event: { trackId: string, isHot: boolean }) {
    this.voteService.vote(event.trackId, event.isHot).subscribe();
  }
}

