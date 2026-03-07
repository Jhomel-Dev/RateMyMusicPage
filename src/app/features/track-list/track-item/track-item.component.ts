import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../core/services/music.service';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-item.component.html',
  styles: [`
    .track-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: var(--transition);
      height: 100%;
    }
    .track-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
      border-color: rgba(99, 102, 241, 0.3);
    }
    .track-info {
        flex: 1;
    }
    .track-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .track-artist {
      font-size: 0.95rem;
      color: var(--accent-primary);
    }
    .track-score {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }
    .score-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .vote-section {
        display: flex;
        gap: 0.5rem;
        margin-top: auto;
    }
    .vote-btn {
        flex: 1;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        color: white;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
        font-size: 1.1rem;
    }
    .vote-btn:hover {
        background: rgba(99, 102, 241, 0.2);
        border-color: var(--accent-primary);
    }
    .vote-up:hover, .vote-btn.active-up { color: #10b981; border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
    .vote-down:hover, .vote-btn.active-down { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
  `]
})
export class TrackItemComponent {
  // Input signals
  track = input.required<Track>();

  // Output events
  onVote = output<{ trackId: string, isHot: boolean }>();

  voteUp() {
    this.onVote.emit({ trackId: this.track().id, isHot: true });
  }

  voteDown() {
    this.onVote.emit({ trackId: this.track().id, isHot: false });
  }
}
