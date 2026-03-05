import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MusicService } from '../../core/services/music.service';
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
  `]
})
export class TrackListComponent implements OnInit {
  musicService = inject(MusicService);

  // Public signal reference for the template
  tracks = this.musicService.tracks;

  ngOnInit() {
    this.musicService.loadTracks();
  }

  handleVote(event: { trackId: string, isHot: boolean }) {
    this.musicService.vote(event.trackId, event.isHot).subscribe();
  }
}
