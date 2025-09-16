# LumiDeck - Project Context & Memory

## Project Overview
LumiDeck is a **production-ready, ad-free, purely-frontend** web app that synchronizes music playlists with image slideshows. Users can play MP3 audio while cycling through photo "playlists" with configurable timing and visual effects.

## Key Design Decisions

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS for utilities, custom CSS for theming
- **State**: Zustand (lightweight state management)
- **Persistence**: IndexedDB via Dexie.js
- **Audio**: HTMLAudioElement + Web Audio API for effects
- **Images**: Standard `<img>` + CSS transforms, Canvas/WebGL for advanced effects
- **Testing**: Vitest + React Testing Library (unit), Playwright (e2e)
- **Build**: Vite with Service Worker (Workbox) for offline support

### Architecture Principles
1. **Universal DB Abstraction**: All data access goes through a `LumiDB` interface with swappable adapters (IndexedDB default, REST for future backend)
2. **Custom SVG Icons**: No external icon libraries - all UI elements are custom SVG components
3. **File System Access**: Use File System Access API where available, fallback to object URLs
4. **Offline-First**: Works completely client-side with no network dependencies
5. **Accessibility**: Full keyboard navigation, ARIA roles, focus management

### Core Data Model
```typescript
// Main entities
- Song: MP3 files with ID3 metadata (title, artist, duration)
- MusicPlaylist: Ordered collections of songs with playback rules
- Photo: Image files (JPG/PNG/WEBP/GIF) with dimensions
- PhotoPlaylist: Ordered collections of photos with timing rules
- MoodPreset: Visual filter configurations
- AppStateSnapshot: Current selections and user settings
```

### File Import Rules
- **Audio**: MP3 only (strict validation with friendly error messages)
- **Images**: JPG, JPEG, PNG, WEBP, GIF only
- **Folder Import**: Auto-creates playlists named after folder
  - MP3s only → Music playlist
  - Images only → Photo playlist  
  - Mixed → Prompt to split into separate playlists
- **Deduplication**: SHA-256 hash comparison across entire library

### Component Architecture
```
AppShell (routing, layout, service worker)
├── NowPlaying (main view with background images + controls)
├── MenuOverlay (translucent navigation)
├── MusicPlaylistEditor (sidebar + track list + drag-drop)
├── PhotoPlaylistEditor (thumbnails + playback rules)
├── SongBank (global music library)
├── ImageLibrary (global photo library)
├── MoodPanel (visual filter presets)
└── UploadDropzone (file/folder validation + progress)
```

### Visual Effects System
- **Mood Presets**: CSS filter chains + optional Canvas overlays
  - Glowy Techno, Bright Day, Nocturne, Neon City, Warm Film, Mono Noir
- **Image Transitions**: Crossfade (default), Cut, Ken Burns (pan/zoom)
- **Timing Modes**: By seconds, on song change, manual advance

### Keyboard Controls
- Space: play/pause
- ←/→: seek 5s or prev/next track
- ↑/↓: prev/next track
- M: menu, Q: queue, G: mood panel
- P: toggle photo advance mode
- S: shuffle, R: repeat cycle
- Alt+↑/↓: reorder items in editors

## Current Phase: Core Implementation
Completed initial setup and architecture planning. Now implementing core database abstraction and services.

## Progress Log
- ✅ **Phase 1: Planning & Research** (Completed)
  - ✅ Project context documentation (AMNESIA.md)
  - ✅ System architecture design with component hierarchy
  - ✅ Technical research for audio/image/DB/file handling best practices
- ✅ **Phase 2: Project Foundation** (Completed)
  - ✅ Vite + React + TypeScript project initialization
  - ✅ All dependencies installed (Zustand, Dexie, Tailwind, etc.)
  - ✅ Project folder structure matching architectural design
  - ✅ Build tools configured (ESLint, Prettier, testing)
  - ✅ PWA foundation with service worker and manifest
- ✅ **Phase 3: Core Systems** (Completed)
  - ✅ Universal DB abstraction layer with IndexedDBAdapter and RESTAdapter
  - ✅ Comprehensive TypeScript interfaces and data model
  - ✅ AudioEngine with queue management, crossfading, and Web Audio API
  - ✅ ImageEngine with transitions, synchronization, and preloading
- ⏳ **Phase 4: UI Implementation** (Next)
  - ⏳ NowPlaying component with background sync
  - ⏳ Custom SVG icon components
  - ⏳ File processing services and upload UI

## Major Milestones Progress
1. ✅ Project structure and dependencies setup
2. ✅ Universal DB abstraction layer (IndexedDBAdapter + RESTAdapter)
3. ✅ Core TypeScript interfaces and data model
4. ✅ Audio and Image engines with Web Audio API
5. ⏳ NowPlaying component with background images and controls
6. ⏳ Playlist editors with drag-drop functionality
7. ⏳ File upload and validation with progress UI
8. ⏳ Mood system with CSS filters and intensity controls
9. ⏳ Testing infrastructure with unit and e2e tests
10. ⏳ Performance optimization and accessibility features

## UltraThink Session Summary
**Session Completed:** Core Infrastructure Phase
**Tasks Completed:** 8/17 (47% of project scope)
**Architecture Status:** ✅ Complete and production-ready
**Core Engines Status:** ✅ AudioEngine + ImageEngine fully implemented
**Next Session Focus:** UI components and user interaction layer

## Important Constraints
- No external icon libraries (custom SVG only)
- No backend dependencies (pure frontend)
- No ads, analytics, or third-party tracking
- MP3-only for audio (strict validation)
- Support File System Access API where available
- Must work offline after initial load
- Keyboard accessible throughout
- Production-ready code quality

## Future Backend Integration
The universal DB abstraction (`LumiDB` interface) allows easy swapping to REST API:
- IndexedDBAdapter (current) → RESTAdapter (future)
- No UI changes required when switching adapters
- REST endpoints follow RESTful patterns with same JSON shapes

## Development Notes
- Keep components small and typed
- Prefer composition over context
- Respect `prefers-reduced-motion`
- Comment File System Access fallbacks
- Use requestIdleCallback for expensive operations (hashing)
- Preload next/prev tracks and images for smooth playback