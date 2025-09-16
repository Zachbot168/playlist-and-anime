import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';
import { TrackCard } from './TrackCard';
import { PlayButton } from './svg/PlayButton';
import { PauseButton } from './svg/PauseButton';
import { MenuButton } from './svg/MenuButton';

export function NowPlaying() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  const {
    getCurrentPhoto,
    getCurrentMoodPreset,
    getCurrentTrack,
    isPlaying,
    setCurrentView,
    toggleSidebar
  } = useAppStore();
  
  const currentPhoto = getCurrentPhoto();
  const currentMoodPreset = getCurrentMoodPreset();
  const currentTrack = getCurrentTrack();
  
  // Apply background image and mood filter
  useEffect(() => {
    if (backgroundRef.current) {
      const element = backgroundRef.current;
      
      if (currentPhoto) {
        element.style.backgroundImage = `url(${currentPhoto.src})`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
      } else {
        // Default background
        element.style.backgroundImage = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)';
      }
      
      // Apply mood filter
      if (currentMoodPreset) {
        element.style.filter = currentMoodPreset.cssFilter;
      } else {
        element.style.filter = 'none';
      }
    }
  }, [currentPhoto, currentMoodPreset]);
  
  const handlePlayPause = () => {
    // TODO: Implement actual audio playback
    useAppStore.getState().setPlaying(!isPlaying);
    console.log('Play/Pause:', !isPlaying);
  };
  
  const handlePrevious = () => {
    // TODO: Implement previous track
    console.log('Previous track');
  };
  
  const handleNext = () => {
    // TODO: Implement next track  
    console.log('Next track');
  };
  
  const handleMenu = () => {
    setCurrentView('menu');
  };
  
  return (
    <div className="w-full h-full relative">
      {/* Background Image with Mood Filter */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 transition-all duration-1000"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full glass-effect hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
      >
        <svg className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full glass-effect hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
      >
        <svg className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>
      
      {/* Track Card */}
      {currentTrack && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <TrackCard track={currentTrack} />
        </div>
      )}
      
      {/* Player Controls */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-4">
        <button 
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 transition-all duration-200 flex items-center justify-center"
        >
          {isPlaying ? (
            <PauseButton className="w-8 h-8 text-white" />
          ) : (
            <PlayButton className="w-8 h-8 text-white" />
          )}
        </button>
        
        <button 
          onClick={handleMenu}
          className="w-12 h-12 rounded-full glass-effect hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
        >
          <MenuButton className="w-6 h-6 text-white/80" />
        </button>
      </div>
      
      {/* Welcome message if no content */}
      {!currentTrack && !currentPhoto && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gradient mb-4">LumiDeck</h1>
            <p className="text-xl text-white/60 mb-8">Music + Image Synchronization</p>
            <button 
              onClick={handleMenu}
              className="px-6 py-3 glass-effect rounded-full text-white hover:bg-white/20 transition-all duration-200"
            >
              Get Started →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}