import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';

const getMovies = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/movies`);
  return res.json();
};

interface Room {
  playlist: string[];
}

const postCreateRoom = async (room: Room) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/room`, {
    method: 'POST',
    body: JSON.stringify({ room }),
    headers: { 'Content-Type': 'application/json' },
  });
  const { roomId } = await res.json();
  return roomId;
};

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const [movies, setMovies] = useState([] as string[]);
  const [playlist, setPlaylist] = useState([] as string[]);

  useEffect(() => {
    getMovies().then(res => setMovies(res.movies));
  }, []);

  const createRoom = async (room: Room) => {
    const roomId = await postCreateRoom(room);
    history.push(`/room/${roomId}`);
  };

  return (
    <>
      <h2>home</h2>
      <MovieList
        movies={movies}
        playlist={playlist}
        setPlaylist={setPlaylist}
      />
      <Playlist
        playlist={playlist}
        setPlaylist={setPlaylist}
        createRoom={createRoom}
      />
    </>
  );
};

const MovieList: React.FC<{
  movies: string[];
  playlist: string[];
  setPlaylist: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ movies, playlist, setPlaylist }) => {
  return (
    <>
      <h3>movie list</h3>
      <ul>
        {movies.map(movie => (
          <MovieItem
            key={movie}
            movie={movie}
            playlist={playlist}
            setPlaylist={setPlaylist}
          />
        ))}
      </ul>
    </>
  );
};

const MovieItem: React.FC<{
  movie: string;
  setPlaylist: React.Dispatch<React.SetStateAction<string[]>>;
  playlist: string[];
}> = ({ movie, setPlaylist, playlist }) => {
  return (
    <>
      <h4>movie item</h4>
      <li>
        {movie}
        <button
          onClick={() => setPlaylist(Array.from(new Set([...playlist, movie])))}
        >
          +
        </button>
      </li>
    </>
  );
};

const Playlist: React.FC<{
  playlist: string[];
  setPlaylist: React.Dispatch<React.SetStateAction<string[]>>;
  createRoom: (room: Room) => void;
}> = ({ playlist, setPlaylist, createRoom }) => (
  <>
    <h3>playlist</h3>
    <button
      disabled={!playlist.length}
      onClick={() => createRoom({ playlist })}
    >
      Create room
    </button>
    <ul>
      {playlist.map(movie => (
        <PlaylistItem
          key={movie}
          movie={movie}
          setPlaylist={setPlaylist}
          playlist={playlist}
        />
      ))}
    </ul>
  </>
);

const PlaylistItem: React.FC<{
  movie: string;
  setPlaylist: React.Dispatch<React.SetStateAction<string[]>>;
  playlist: string[];
}> = ({ movie, setPlaylist, playlist }) => {
  return (
    <>
      <h4>playlist item</h4>
      <li>
        {movie}
        <button onClick={() => setPlaylist(playlist.filter(m => m !== movie))}>
          -
        </button>
      </li>
    </>
  );
};

export default Home;
