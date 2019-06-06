import React from 'react';

const Movie: React.FC<{
  src: string;
}> = ({ src }) => {
  return (
    <video
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
