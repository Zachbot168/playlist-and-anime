import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import type { Song, MusicPlaylist, Photo, PhotoPlaylist, MoodPreset, ID } from '../types';
import { AudioEngine } from '../services/AudioEngine';
import { generateId } from '../utils';

// Default mood presets
const DEFAULT_MOOD_PRESETS: MoodPreset[] = [
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

interface AppStore {
  // UI State  
  currentView: 'nowplaying' | 'menu' | 'musiceditor' | 'photoeditor' | 'mood';
  sidebarOpen: boolean;
  volume: number;
  
  // Data
  songs: Song[];
  musicPlaylists: MusicPlaylist[];
  photos: Photo[];
  photoPlaylists: PhotoPlaylist[];
  moodPresets: MoodPreset[];
  
  // Current Selections
  currentMusicPlaylistId: ID | null;
  currentPhotoPlaylistId: ID | null;
  currentMoodPresetId: ID | null;
  currentTrackId: ID | null;
  currentPhotoIndex: number;
  
  // Transient state (not persisted)
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  
  // Actions
  setCurrentView: (view: AppStore['currentView']) => void;
  toggleSidebar: () => void;
  
  // Music Actions
  addSong: (song: Song) => void;
  removeSongs: (ids: ID[]) => void;
  createMusicPlaylist: (name: string) => MusicPlaylist;
  updateMusicPlaylist: (id: ID, updates: Partial<MusicPlaylist>) => void;
  deleteMusicPlaylist: (id: ID) => void;
  setCurrentMusicPlaylist: (id: ID | null) => void;
  
  // Photo Actions
  addPhoto: (photo: Photo) => void;
  removePhotos: (ids: ID[]) => void;
  createPhotoPlaylist: (name: string) => PhotoPlaylist;
  updatePhotoPlaylist: (id: ID, updates: Partial<PhotoPlaylist>) => void;
  deletePhotoPlaylist: (id: ID) => void;
  setCurrentPhotoPlaylist: (id: ID | null) => void;
  setCurrentPhotoIndex: (index: number) => void;
  
  // Mood Actions
  setCurrentMoodPreset: (id: ID | null) => void;
  updateMoodPreset: (id: ID, updates: Partial<MoodPreset>) => void;
  
  // Playback Actions (transient)
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (id: ID | null) => void;
  setTime: (currentTime: number, duration: number) => void;
  setVolume: (volume: number) => void;
  
  // Getters
  getCurrentMusicPlaylist: () => MusicPlaylist | null;
  getCurrentPhotoPlaylist: () => PhotoPlaylist | null;
  getCurrentMoodPreset: () => MoodPreset | null;
  getCurrentTrack: () => Song | null;
  getCurrentPhoto: () => Photo | null;
  getPlaylistSongs: (playlistId: ID) => Song[];
  getPlaylistPhotos: (playlistId: ID) => Photo[];
}

export const useAppStore = create<AppStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // UI State
      currentView: 'nowplaying',
      sidebarOpen: false,
      volume: 0.8,
      
      // Data (persisted)
      songs: [],
      musicPlaylists: [],
      photos: [],
      photoPlaylists: [],
      moodPresets: DEFAULT_MOOD_PRESETS,
      
      // Current Selections (persisted)
      currentMusicPlaylistId: null,
      currentPhotoPlaylistId: null,
      currentMoodPresetId: null,
      currentTrackId: null,
      currentPhotoIndex: 0,
      
      // Transient state (not persisted)
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      
      // Actions
      setCurrentView: (view) => set({ currentView: view }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Music Actions
      addSong: (song) => set((state) => ({ 
        songs: [...state.songs.filter(s => s.id !== song.id), song]
      })),
      
      removeSongs: (ids) => set((state) => ({
        songs: state.songs.filter(s => !ids.includes(s.id)),
        musicPlaylists: state.musicPlaylists.map(p => ({
          ...p,
          songIds: p.songIds.filter(id => !ids.includes(id))
        }))
      })),
      
      createMusicPlaylist: (name) => {
        const playlist: MusicPlaylist = {
          id: generateId(),
          name,
          songIds: [],
          playOrder: 'sequential',
          repeatMode: 'none',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ 
          musicPlaylists: [playlist, ...state.musicPlaylists]
        }));
        return playlist;
      },
      
      updateMusicPlaylist: (id, updates) => set((state) => ({
        musicPlaylists: state.musicPlaylists.map(p => 
          p.id === id 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        )
      })),
      
      deleteMusicPlaylist: (id) => set((state) => ({
        musicPlaylists: state.musicPlaylists.filter(p => p.id !== id),
        currentMusicPlaylistId: state.currentMusicPlaylistId === id ? null : state.currentMusicPlaylistId
      })),
      
      setCurrentMusicPlaylist: (id) => set({ currentMusicPlaylistId: id }),
      
      // Photo Actions
      addPhoto: (photo) => set((state) => ({ 
        photos: [...state.photos.filter(p => p.id !== photo.id), photo]
      })),
      
      removePhotos: (ids) => set((state) => ({
        photos: state.photos.filter(p => !ids.includes(p.id)),
        photoPlaylists: state.photoPlaylists.map(pl => ({
          ...pl,
          photoIds: pl.photoIds.filter(id => !ids.includes(id))
        }))
      })),
      
      createPhotoPlaylist: (name) => {
        const playlist: PhotoPlaylist = {
          id: generateId(),
          name,
          photoIds: [],
          timingRules: {
            mode: 'seconds',
            durationSec: 8,
            transition: 'crossfade',
            transitionDurationMs: 1000
          },
          randomize: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({ 
          photoPlaylists: [playlist, ...state.photoPlaylists]
        }));
        return playlist;
      },
      
      updatePhotoPlaylist: (id, updates) => set((state) => ({
        photoPlaylists: state.photoPlaylists.map(p => 
          p.id === id 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        )
      })),
      
      deletePhotoPlaylist: (id) => set((state) => ({
        photoPlaylists: state.photoPlaylists.filter(p => p.id !== id),
        currentPhotoPlaylistId: state.currentPhotoPlaylistId === id ? null : state.currentPhotoPlaylistId
      })),
      
      setCurrentPhotoPlaylist: (id) => set({ currentPhotoPlaylistId: id, currentPhotoIndex: 0 }),
      setCurrentPhotoIndex: (index) => set({ currentPhotoIndex: index }),
      
      // Mood Actions
      setCurrentMoodPreset: (id) => set({ currentMoodPresetId: id }),
      
      updateMoodPreset: (id, updates) => set((state) => ({
        moodPresets: state.moodPresets.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      
      // Playback Actions (transient - not persisted)
      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTrack: (id) => set({ currentTrackId: id }),
      setTime: (currentTime, duration) => set({ currentTime, duration }),
      setVolume: (volume) => set({ volume }),
      
      // Getters
      getCurrentMusicPlaylist: () => {
        const { musicPlaylists, currentMusicPlaylistId } = get();
        return currentMusicPlaylistId ? musicPlaylists.find(p => p.id === currentMusicPlaylistId) || null : null;
      },
      
      getCurrentPhotoPlaylist: () => {
        const { photoPlaylists, currentPhotoPlaylistId } = get();
        return currentPhotoPlaylistId ? photoPlaylists.find(p => p.id === currentPhotoPlaylistId) || null : null;
      },
      
      getCurrentMoodPreset: () => {
        const { moodPresets, currentMoodPresetId } = get();
        return currentMoodPresetId ? moodPresets.find(p => p.id === currentMoodPresetId) || null : null;
      },
      
      getCurrentTrack: () => {
        const { songs, currentTrackId } = get();
        return currentTrackId ? songs.find(s => s.id === currentTrackId) || null : null;
      },
      
      getCurrentPhoto: () => {
        const { photos, currentPhotoIndex } = get();
        const photoPlaylist = get().getCurrentPhotoPlaylist();
        if (!photoPlaylist || photoPlaylist.photoIds.length === 0) return null;
        
        const photoId = photoPlaylist.photoIds[currentPhotoIndex];
        return photoId ? photos.find(p => p.id === photoId) || null : null;
      },
      
      getPlaylistSongs: (playlistId) => {
        const { songs, musicPlaylists } = get();
        const playlist = musicPlaylists.find(p => p.id === playlistId);
        if (!playlist) return [];
        
        return playlist.songIds
          .map(id => songs.find(s => s.id === id))
          .filter(Boolean) as Song[];
      },
      
      getPlaylistPhotos: (playlistId) => {
        const { photos, photoPlaylists } = get();
        const playlist = photoPlaylists.find(p => p.id === playlistId);
        if (!playlist) return [];
        
        return playlist.photoIds
          .map(id => photos.find(p => p.id === id))
          .filter(Boolean) as Photo[];
      }
    })),
    {
      name: 'lumideck-storage',
      partialize: (state) => ({
        // Only persist certain parts of the state
        currentView: state.currentView,
        volume: state.volume,
        songs: state.songs,
        musicPlaylists: state.musicPlaylists,
        photos: state.photos,
        photoPlaylists: state.photoPlaylists,
        moodPresets: state.moodPresets,
        currentMusicPlaylistId: state.currentMusicPlaylistId,
        currentPhotoPlaylistId: state.currentPhotoPlaylistId,
        currentMoodPresetId: state.currentMoodPresetId,
        currentTrackId: state.currentTrackId,
        currentPhotoIndex: state.currentPhotoIndex,
      })
    }
  )
);