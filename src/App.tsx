import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Your actual files
  const musicFiles = [
    'motivation-motivational-background-music-388288.mp3',
    'soft-background-music-368633.mp3',
    'soft-background-music-401914.mp3'
  ];
  
  const imageFiles = [
    '4249139.jpg',
    'anime-style-character-space.jpg',
    'anime-style-galaxy-background.jpg',
    'anime-style-mythical-dragon-creature.jpg',
    'cyberpunk-urban-scenery.jpg',
    'illustration-anime-city-2.jpg',
    'illustration-anime-city.jpg'
  ];
  
  const currentTrack = musicFiles[currentTrackIndex];
  const currentImage = imageFiles[currentImageIndex];
  
  // Change background image every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageFiles.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [imageFiles.length]);
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    
    const handleEnded = () => {
      // Auto play next track
      setCurrentTrackIndex((prev) => (prev + 1) % musicFiles.length);
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateTime);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [musicFiles.length]);
  
  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = `/default_music/${currentTrack}`;
    audio.load();
    
    if (isPlaying) {
      audio.play();
    }
  }, [currentTrackIndex, currentTrack]);
  
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (error) {
        console.error('Failed to play:', error);
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const previousTrack = () => {
    setCurrentTrackIndex((prev) => 
      prev === 0 ? musicFiles.length - 1 : prev - 1
    );
  };
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicFiles.length);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background Image */}
      <img 
        src={`/default_images/${currentImage}`}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Audio Element */}
      <audio ref={audioRef} />
      
      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 text-white">
          {/* Track Info */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">
              {currentTrack.replace('.mp3', '').replace(/-/g, ' ')}
            </h2>
            <p className="text-white/60 text-sm">
              Track {currentTrackIndex + 1} of {musicFiles.length}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ 
                  width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button 
              onClick={previousTrack}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              ⏮️
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button 
              onClick={nextTrack}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              ⏭️
            </button>
          </div>
        </div>
      </div>
      
      {/* Image Info */}
      <div className="absolute top-8 right-8">
        <div className="bg-black/50 backdrop-blur-lg rounded-lg px-4 py-2 text-white text-sm">
          Image {currentImageIndex + 1}/{imageFiles.length}
        </div>
      </div>
    </div>
  );
}