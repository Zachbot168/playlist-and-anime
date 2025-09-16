interface PlayButtonProps {
  className?: string;
}

export function PlayButton({ className = "w-6 h-6" }: PlayButtonProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );
}