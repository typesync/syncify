import React, { useRef } from 'react';
import ReactPlayer from 'react-player';

const Movie: React.FC<{
  src: string;
  playing: boolean;
  onPause: () => any;
  onPlay: () => any;
}> = ({ src, onPlay, onPause, playing }) => {
  const videoRef = useRef<ReactPlayer>(null);

  return (
    <>
      <ReactPlayer
        ref={videoRef}
        style={{
          width: '100%',
          height: 'auto',
        }}
        url={`${process.env.REACT_APP_API_URL}/movies/${src}`}
        playing={playing}
        playsinline={true}
      />
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
    </>
  );
};

export default Movie;
