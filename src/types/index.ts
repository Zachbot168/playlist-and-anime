// LumiDeck Core Types
export type ID = string;

export interface Song {
  id: ID;
  title: string;
  artist?: string;
  durationSec?: number;
  srcKind: 'file' | 'url';
  src: string; // object URL or remote URL
  hash?: string; // sha-256 for de-dupe
  filename: string;
  fileSize: number;
  addedAt: string; // ISO
}

export interface MusicPlaylist {
  id: ID;
  name: string;
  songIds: ID[]; // order matters
  playOrder: 'sequential' | 'reverse' | 'shuffle' | 'weighted';
  repeatMode: 'none' | 'one' | 'all';
  crossfadeSec?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: ID;
  title: string;
  srcKind: 'file' | 'url';
  src: string;
  width?: number;
  height?: number;
  hash?: string;
  filename: string;
  fileSize: number;
  addedAt: string;
}

export interface PhotoPlaylist {
  id: ID;
  name: string;
  description?: string;
  photoIds: ID[];
  timingRules: {
    mode: 'seconds' | 'songChange' | 'manual';
    durationSec?: number;
    transition: 'crossfade' | 'cut' | 'kenburns';
    transitionDurationMs?: number;
  };
  randomize: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoodPreset {
  id: ID;
  name: string;
  intensity: number; // 0-100
  cssFilter: string;
  options: { 
    vignette?: boolean; 
    grain?: boolean;
  };
}

export interface AppStateSnapshot {
  selectedMusicPlaylistId?: ID;
  selectedPhotoPlaylistId?: ID;
  moodPresetId?: ID;
  volume: number; // 0-1
  theme: 'light' | 'dark' | 'system';
  lastSaved: number;
}