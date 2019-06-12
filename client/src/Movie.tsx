import React, { useRef, useEffect } from 'react';

const Movie: React.FC<{
  src: string;
  isPlaying: boolean;
  onPlay: () => any;
}> = ({ src, onPlay, isPlaying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('play', event => {
        console.log('on play');
        event.preventDefault();
        onPlay();
      });
    }
  }, [onPlay, videoRef]);

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      console.log('play');
      videoRef.current.play();
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      controls
      style={{
        width: '100%',
        height: 'auto',
      }}
    >
      <source
        src={`${process.env.REACT_APP_API_URL}/movies/${src}`}
        type="video/mp4"
      />
    </video>
  );
};

export default Movie;
