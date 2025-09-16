import type { Song, MusicPlaylist, Photo, PhotoPlaylist, MoodPreset, AppStateSnapshot, ID } from '../types';

// Universal Database Interface
export interface LumiDB {
  // Songs
  listSongs(): Promise<Song[]>;
  getSong(id: ID): Promise<Song | undefined>;
  upsertSong(song: Song): Promise<void>;
  removeSongs(ids: ID[]): Promise<void>;

  // Music Playlists
  listMusicPlaylists(): Promise<MusicPlaylist[]>;
  getMusicPlaylist(id: ID): Promise<MusicPlaylist | undefined>;
  upsertMusicPlaylist(playlist: MusicPlaylist): Promise<void>;
  removeMusicPlaylists(ids: ID[]): Promise<void>;

  // Photos
  listPhotos(): Promise<Photo[]>;
  getPhoto(id: ID): Promise<Photo | undefined>;
  upsertPhoto(photo: Photo): Promise<void>;
  removePhotos(ids: ID[]): Promise<void>;

  // Photo Playlists
  listPhotoPlaylists(): Promise<PhotoPlaylist[]>;
  getPhotoPlaylist(id: ID): Promise<PhotoPlaylist | undefined>;
  upsertPhotoPlaylist(playlist: PhotoPlaylist): Promise<void>;
  removePhotoPlaylists(ids: ID[]): Promise<void>;

  // Mood Presets
  listMoodPresets(): Promise<MoodPreset[]>;
  getMoodPreset(id: ID): Promise<MoodPreset | undefined>;
  upsertMoodPreset(preset: MoodPreset): Promise<void>;

  // App State
  getSnapshot(): Promise<AppStateSnapshot>;
  setSnapshot(snapshot: AppStateSnapshot): Promise<void>;
}

// Database Configuration
export interface DBConfig {
  type: 'indexeddb' | 'rest';
  restBaseUrl?: string;
}

export const DEFAULT_DB_CONFIG: DBConfig = {
  type: 'indexeddb'
};