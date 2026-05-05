import { Component, inject, OnInit, signal, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrackService } from '../../core/services/track.service';
import { InteractionService } from '../../core/services/interaction.service';
import { TrackItemComponent } from './track-item/track-item.component';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TrackItemComponent],
  templateUrl: './track-list.component.html',
  styles: [`:host { display: block; }`]
})
export class TrackListComponent implements OnInit, AfterViewInit {
  trackService = inject(TrackService);
  interactionService = inject(InteractionService);

  @ViewChild('feedContainer') feedContainer!: ElementRef<HTMLElement>;

  // Public signal reference for the template
  tracks = this.trackService.feed;

  // Comments panel visibility
  showComments = signal(false);

  ngOnInit() {
    this.trackService.loadFeed();
  }

  ngAfterViewInit() {
    this.setupInfiniteScroll();
  }

  setupInfiniteScroll() {
    const options = {
      root: this.feedContainer.nativeElement,
      rootMargin: '0px',
      threshold: 0.1
    };

    // We can observe the last element to trigger loading more
    // But since elements are added dynamically, we might need a better strategy.
    // For now, let's use a simple scroll listener on the container.
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
    if (scrollKeys.includes(event.key) && this.tracks().length <= 1) {
      event.preventDefault();
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
      if (!this.trackService.isLoading()) {
        this.trackService.loadFeed();
      }
    }
  }

  toggleComments() {
    this.showComments.update(v => !v);
  }
}
