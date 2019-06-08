import React, { useRef, useEffect } from 'react';

const Movie: React.FC<{
  src: string;
  onPlay: () => any;
}> = ({ src, onPlay }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('effect ran');
    if (videoRef.current) {
      console.log('videoRef.current was defined');
      videoRef.current.addEventListener('play', onPlay);
    }
  }, [onPlay, videoRef]);

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
