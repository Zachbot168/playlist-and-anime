import { useAppStore } from '../stores/appStore';
import { generateId } from '../utils';

export function MenuOverlay() {
  const { setCurrentView, createMusicPlaylist, createPhotoPlaylist } = useAppStore();
  
  const handleClose = () => {
    setCurrentView('nowplaying');
  };
  
  const handleUploadMusic = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        handleFilesSelected(Array.from(files), 'music');
      }
    };
    input.click();
  };
  
  const handleUploadImages = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.webp,.gif';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        handleFilesSelected(Array.from(files), 'images');
      }
    };
    input.click();
  };
  
  const handleFilesSelected = async (files: File[], type: 'music' | 'images') => {
    const { addSong, addPhoto } = useAppStore.getState();
    
    for (const file of files) {
      const id = generateId();
      const src = URL.createObjectURL(file);
      
      if (type === 'music' && file.type === 'audio/mpeg') {
        // Create song object
        const song = {
          id,
          title: file.name.replace('.mp3', ''),
          srcKind: 'file' as const,
          src,
          filename: file.name,
          fileSize: file.size,
          addedAt: new Date().toISOString()
        };
        
        addSong(song);
        
        // Try to get audio duration
        const audio = new Audio(src);
        audio.addEventListener('loadedmetadata', () => {
          addSong({ ...song, durationSec: Math.floor(audio.duration) });
        });
        
      } else if (type === 'images') {
        // Create photo object
        const photo = {
          id,
          title: file.name.replace(/\.(jpg|jpeg|png|webp|gif)$/i, ''),
          srcKind: 'file' as const,
          src,
          filename: file.name,
          fileSize: file.size,
          addedAt: new Date().toISOString()
        };
        
        addPhoto(photo);
        
        // Try to get image dimensions
        const img = new Image();
        img.onload = () => {
          addPhoto({ ...photo, width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = src;
      }
    }
    
    console.log(`Added ${files.length} ${type} files`);
  };
  
  const handleCreateMusicPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      createMusicPlaylist(name);
    }
  };
  
  const handleCreatePhotoPlaylist = () => {
    const name = prompt('Enter photo playlist name:');
    if (name) {
      createPhotoPlaylist(name);
    }
  };
  
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="glass-effect rounded-3xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Music Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Music</h3>
            <div className="space-y-2">
              <button 
                onClick={handleUploadMusic}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                📁 Upload Music Files
              </button>
              <button 
                onClick={handleCreateMusicPlaylist}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                📝 Create Music Playlist
              </button>
            </div>
          </div>
          
          {/* Photos Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Photos</h3>
            <div className="space-y-2">
              <button 
                onClick={handleUploadImages}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                🖼️ Upload Images
              </button>
              <button 
                onClick={handleCreatePhotoPlaylist}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                📋 Create Photo Playlist
              </button>
            </div>
          </div>
          
          {/* Mood Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Mood</h3>
            <button 
              onClick={() => console.log('Change mood')}
              className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              🎨 Change Mood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}