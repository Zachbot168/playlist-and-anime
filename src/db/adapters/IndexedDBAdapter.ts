import Dexie, { Table } from 'dexie';
import type { LumiDB } from '../LumiDB';
import type { Song, MusicPlaylist, Photo, PhotoPlaylist, MoodPreset, AppStateSnapshot, ID } from '../../types';

class LumiDexie extends Dexie {
  songs!: Table<Song>;
  musicPlaylists!: Table<MusicPlaylist>;
  photos!: Table<Photo>;
  photoPlaylists!: Table<PhotoPlaylist>;
  moodPresets!: Table<MoodPreset>;
  appState!: Table<AppStateSnapshot & { id: string }>;

  constructor() {
    super('LumiDeck');
    
    this.version(1).stores({
      songs: 'id, title, artist, hash, addedAt',
      musicPlaylists: 'id, name, createdAt, updatedAt',
      photos: 'id, title, hash, addedAt',
      photoPlaylists: 'id, name, createdAt, updatedAt',
      moodPresets: 'id, name',
      appState: 'id'
    });
  }
}

export class IndexedDBAdapter implements LumiDB {
  private db: LumiDexie;

  constructor() {
    this.db = new LumiDexie();
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    // Initialize default mood presets if none exist
    const existingPresets = await this.db.moodPresets.count();
    if (existingPresets === 0) {
      const defaultPresets: MoodPreset[] = [
        {
          id: 'glowy-techno',
          name: 'Glowy Techno',
          intensity: 75,
          cssFilter: 'brightness(1.1) saturate(1.4) blur(0.5px) hue-rotate(15deg)',
          options: { vignette: false, grain: false }
        },
        {
          id: 'bright-day',
          name: 'Bright Day',
          intensity: 60,
          cssFilter: 'brightness(1.3) saturate(1.1) contrast(1.1)',
          options: { vignette: false, grain: false }
        },
        {
          id: 'nocturne',
          name: 'Nocturne',
          intensity: 80,
          cssFilter: 'brightness(0.7) contrast(1.2) saturate(0.8) hue-rotate(-10deg)',
          options: { vignette: true, grain: false }
        },
        {
          id: 'neon-city',
          name: 'Neon City',
          intensity: 90,
          cssFilter: 'saturate(1.6) hue-rotate(45deg) contrast(1.1) brightness(1.1)',
          options: { vignette: false, grain: false }
        },
        {
          id: 'warm-film',
          name: 'Warm Film',
          intensity: 65,
          cssFilter: 'sepia(0.3) saturate(1.2) brightness(1.05) contrast(1.05)',
          options: { vignette: true, grain: true }
        },
        {
          id: 'mono-noir',
          name: 'Mono Noir',
          intensity: 85,
          cssFilter: 'grayscale(1) contrast(1.3) brightness(0.9)',
          options: { vignette: true, grain: true }
        }
      ];

      await this.db.moodPresets.bulkAdd(defaultPresets);
    }

    // Initialize default app state if none exists
    const existingState = await this.db.appState.get('main');
    if (!existingState) {
      const defaultState: AppStateSnapshot & { id: string } = {
        id: 'main',
        volume: 0.8,
        theme: 'system',
        lastSaved: Date.now()
      };
      await this.db.appState.add(defaultState);
    }
  }

  // Songs
  async listSongs(): Promise<Song[]> {
    return await this.db.songs.orderBy('addedAt').reverse().toArray();
  }

  async getSong(id: ID): Promise<Song | undefined> {
    return await this.db.songs.get(id);
  }

  async upsertSong(song: Song): Promise<void> {
    await this.db.songs.put(song);
  }

  async removeSongs(ids: ID[]): Promise<void> {
    await this.db.songs.bulkDelete(ids);
  }

  // Music Playlists
  async listMusicPlaylists(): Promise<MusicPlaylist[]> {
    return await this.db.musicPlaylists.orderBy('updatedAt').reverse().toArray();
  }

  async getMusicPlaylist(id: ID): Promise<MusicPlaylist | undefined> {
    return await this.db.musicPlaylists.get(id);
  }

  async upsertMusicPlaylist(playlist: MusicPlaylist): Promise<void> {
    await this.db.musicPlaylists.put(playlist);
  }

  async removeMusicPlaylists(ids: ID[]): Promise<void> {
    await this.db.musicPlaylists.bulkDelete(ids);
  }

  // Photos
  async listPhotos(): Promise<Photo[]> {
    return await this.db.photos.orderBy('addedAt').reverse().toArray();
  }

  async getPhoto(id: ID): Promise<Photo | undefined> {
    return await this.db.photos.get(id);
  }

  async upsertPhoto(photo: Photo): Promise<void> {
    await this.db.photos.put(photo);
  }

  async removePhotos(ids: ID[]): Promise<void> {
    await this.db.photos.bulkDelete(ids);
  }

  // Photo Playlists
  async listPhotoPlaylists(): Promise<PhotoPlaylist[]> {
    return await this.db.photoPlaylists.orderBy('updatedAt').reverse().toArray();
  }

  async getPhotoPlaylist(id: ID): Promise<PhotoPlaylist | undefined> {
    return await this.db.photoPlaylists.get(id);
  }

  async upsertPhotoPlaylist(playlist: PhotoPlaylist): Promise<void> {
    await this.db.photoPlaylists.put(playlist);
  }

  async removePhotoPlaylists(ids: ID[]): Promise<void> {
    await this.db.photoPlaylists.bulkDelete(ids);
  }

  // Mood Presets
  async listMoodPresets(): Promise<MoodPreset[]> {
    return await this.db.moodPresets.orderBy('name').toArray();
  }

  async getMoodPreset(id: ID): Promise<MoodPreset | undefined> {
    return await this.db.moodPresets.get(id);
  }

  async upsertMoodPreset(preset: MoodPreset): Promise<void> {
    await this.db.moodPresets.put(preset);
  }

  // App State
  async getSnapshot(): Promise<AppStateSnapshot> {
    const state = await this.db.appState.get('main');
    if (!state) {
      const defaultState: AppStateSnapshot = {
        volume: 0.8,
        theme: 'system',
        lastSaved: Date.now()
      };
      await this.setSnapshot(defaultState);
      return defaultState;
    }
    
    const { id, ...snapshot } = state;
    return snapshot;
  }

  async setSnapshot(snapshot: AppStateSnapshot): Promise<void> {
    await this.db.appState.put({
      id: 'main',
      ...snapshot,
      lastSaved: Date.now()
    });
  }
}