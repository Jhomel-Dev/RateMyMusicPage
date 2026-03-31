import { Component, inject, OnInit, signal, HostListener, ElementRef } from '@angular/core';
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
  styles: [`:host { display: block; }`]
})
export class TrackListComponent implements OnInit {
  trackService = inject(TrackService);
  voteService = inject(VoteService);

  // Public signal reference for the template
  tracks = this.trackService.tracks;

  // Comments panel visibility
  showComments = signal(false);

  ngOnInit() {
    this.trackService.loadTracks();
  }

  /** Block scroll keys when there's nothing to scroll to */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
    if (scrollKeys.includes(event.key) && this.tracks().length <= 1) {
      event.preventDefault();
    }
  }

  toggleComments() {
    this.showComments.update(v => !v);
  }

  handleVote(event: { trackId: string, isHot: boolean }) {
    this.voteService.vote(event.trackId, event.isHot).subscribe();
  }
}

