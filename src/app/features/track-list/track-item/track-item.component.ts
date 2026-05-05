import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../core/interfaces/track.interface';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import { InteractionService } from '../../../core/services/interaction.service';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-item.component.html',
  styles: []
})
export class TrackItemComponent {
  private audioPlayerService = inject(AudioPlayerService);
  private interactionService = inject(InteractionService);

  // Input signals
  track = input.required<Track>();

  // Output events
  onToggleComments = output<void>();

  // Computed state
  isPlaying = computed(() => 
    this.audioPlayerService.currentTrack()?.id === this.track().id && 
    this.audioPlayerService.isPlaying()
  );

  togglePlay() {
    this.audioPlayerService.playTrack(this.track());
  }

  voteUp() {
    this.interactionService.vote(this.track().id, 'upvote').subscribe();
  }

  voteDown() {
    this.interactionService.vote(this.track().id, 'downvote').subscribe();
  }

  toggleFavorite() {
    this.interactionService.toggleFavorite(this.track().id).subscribe();
  }

  toggleComments() {
    this.onToggleComments.emit();
  }
}
