import type { Song, MusicPlaylist } from '../types';

export interface AudioEngineEvents {
  timeUpdate: { currentTime: number; duration: number };
  trackEnded: { track: Song };
  trackChanged: { track: Song; index: number };
  playStateChanged: { isPlaying: boolean };
  volumeChanged: { volume: number };
}

export class AudioEngine extends EventTarget {
  private audio: HTMLAudioElement;
  private currentTrack: Song | null = null;
  private playlist: MusicPlaylist | null = null;
  private tracks: Song[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private volume = 0.8;

  constructor() {
    super();
    this.audio = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.dispatchEvent(new CustomEvent('timeUpdate', {
        detail: {
          currentTime: this.audio.currentTime,
          duration: this.audio.duration || 0
        }
      }));
    });

    this.audio.addEventListener('ended', () => {
      if (this.currentTrack) {
        this.dispatchEvent(new CustomEvent('trackEnded', {
          detail: { track: this.currentTrack }
        }));
      }
      this.next();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.dispatchEvent(new CustomEvent('playStateChanged', {
        detail: { isPlaying: true }
      }));
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.dispatchEvent(new CustomEvent('playStateChanged', {
        detail: { isPlaying: false }
      }));
    });
  }

  setPlaylist(playlist: MusicPlaylist, tracks: Song[]) {
    this.playlist = playlist;
    this.tracks = [...tracks];
    this.currentIndex = 0;
    
    if (this.tracks.length > 0) {
      this.loadTrack(0);
    }
  }

  private loadTrack(index: number) {
    if (index < 0 || index >= this.tracks.length) return;
    
    this.currentIndex = index;
    this.currentTrack = this.tracks[index];
    this.audio.src = this.currentTrack.src;
    this.audio.load();

    this.dispatchEvent(new CustomEvent('trackChanged', {
      detail: {
        track: this.currentTrack,
        index: this.currentIndex
      }
    }));
  }

  async play() {
    if (!this.currentTrack) return;
    try {
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  pause() {
    this.audio.pause();
  }

  async togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  next() {
    if (!this.playlist) return;
    
    let nextIndex = this.currentIndex + 1;
    
    if (nextIndex >= this.tracks.length) {
      if (this.playlist.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        this.pause();
        return;
      }
    }
    
    this.loadTrack(nextIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  previous() {
    if (!this.playlist) return;
    
    let prevIndex = this.currentIndex - 1;
    
    if (prevIndex < 0) {
      if (this.playlist.repeatMode === 'all') {
        prevIndex = this.tracks.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    
    this.loadTrack(prevIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
    
    this.dispatchEvent(new CustomEvent('volumeChanged', {
      detail: { volume: this.volume }
    }));
  }

  getVolume(): number {
    return this.volume;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  getCurrentTrack(): Song | null {
    return this.currentTrack;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getPlaylist(): MusicPlaylist | null {
    return this.playlist;
  }

  getTracks(): Song[] {
    return [...this.tracks];
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}