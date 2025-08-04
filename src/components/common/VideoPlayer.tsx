'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-md group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
      />
      {!controls && (
        <>
          <div
            className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300"
            onClick={togglePlay}
          />
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {isPlaying ? (
              <Pause className="w-14 h-14 text-white drop-shadow-md" />
            ) : (
              <Play className="w-14 h-14 text-white drop-shadow-md" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
