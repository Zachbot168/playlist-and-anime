import type { Song } from '../types';
import { useAppStore } from '../stores/appStore';

interface TrackCardProps {
  track: Song;
}

export function TrackCard({ track }: TrackCardProps) {
  const { getCurrentMusicPlaylist } = useAppStore();
  const currentPlaylist = getCurrentMusicPlaylist();
  
  return (
    <div className="glass-effect rounded-2xl p-6 min-w-80 max-w-96">
      <div className="flex items-center space-x-4">
        {/* Album Art Placeholder */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {track.title}
          </h3>
          {track.artist && (
            <p className="text-white/60 truncate">
              {track.artist}
            </p>
          )}
          {currentPlaylist && (
            <p className="text-sm text-white/40 truncate">
              from {currentPlaylist.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}