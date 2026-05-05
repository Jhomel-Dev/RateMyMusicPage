import { Injectable, signal, computed, inject } from '@angular/core';
import { Track } from '../interfaces/track.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private audio = new Audio();

  private readonly currentTrackSignal = signal<Track | null>(null);
  private readonly isPlayingSignal = signal<boolean>(false);
  private readonly progressSignal = signal<number>(0);
  private readonly durationSignal = signal<number>(0);
  private readonly volumeSignal = signal<number>(0.5);

  readonly currentTrack = computed(() => this.currentTrackSignal());
  readonly isPlaying = computed(() => this.isPlayingSignal());
  readonly progress = computed(() => this.progressSignal());
  readonly duration = computed(() => this.durationSignal());
  readonly volume = computed(() => this.volumeSignal());

  constructor() {
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audio.volume = this.volumeSignal();
    this.audio.addEventListener('timeupdate', () => this.progressSignal.set(this.audio.currentTime));
    this.audio.addEventListener('durationchange', () => this.durationSignal.set(this.audio.duration));
    this.audio.addEventListener('ended', () => this.handleAudioEnded());
    this.audio.addEventListener('play', () => this.isPlayingSignal.set(true));
    this.audio.addEventListener('pause', () => this.isPlayingSignal.set(false));
  }

  private handleAudioEnded() {
    this.isPlayingSignal.set(false);
    this.progressSignal.set(0);
  }

  playTrack(track: Track) {
    if (this.currentTrackSignal()?.id === track.id) {
      this.togglePlay();
      return;
    }

    this.loadAndPlay(track);
  }

  private loadAndPlay(track: Track) {
    this.currentTrackSignal.set(track);
    this.audio.src = track.audioUrl;
    this.audio.load();
    this.audio.play();
    this.registerPlay(track.id);
  }

  togglePlay() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  seekTo(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.volumeSignal.set(volume);
    this.audio.volume = volume;
  }

  private registerPlay(trackId: string) {
    this.http.post(`${this.apiUrl}/tracks/${trackId}/play`, {}).subscribe({
      error: (err) => console.error('Play registration failed', err)
    });
  }
}
