import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../core/interfaces/track.interface';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-item.component.html',
  styles: []
})
export class TrackItemComponent {
  // Input signals
  track = input.required<Track>();

  // Output events
  onVote = output<{ trackId: string, isHot: boolean }>();
  onToggleComments = output<void>();

  voteUp() {
    this.onVote.emit({ trackId: this.track().id, isHot: true });
  }

  voteDown() {
    this.onVote.emit({ trackId: this.track().id, isHot: false });
  }

  toggleComments() {
    this.onToggleComments.emit();
  }
}
