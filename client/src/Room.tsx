import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import io from 'socket.io-client';
import { Room as RoomModel } from 'shared';
import Movie from './Movie';

const Room: React.FC<RouteComponentProps<{ roomId: string }>> = ({
  match: {
    params: { roomId },
  },
}) => {
  const [playlist, setPlaylist] = useState([] as string[]);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    if (!socket) {
      const s = io(`${process.env.REACT_APP_API_URL}`);
      s.on('connect', () => {
        setSocket(s);
      });
    } else {
      socket.emit('Get Room', roomId, (room: RoomModel) => {
        setPlaylist(room.playlist);
      });
      socket.on('Play', () => {
        console.log('play');
      });
    }
  }, [socket, roomId]);

  const emitPlay = () => {
    if (socket) {
      socket.emit('Play', roomId);
    }
  };

  return (
    <>
      <h2>Room {roomId}</h2>
      <ul>
        {playlist.map(movie => (
          <div key={movie}>
            <h3>playlist item</h3>
            {/* <li key={movie}>{movie}</li> */}
            <Movie key={movie} src={movie} onPlay={emitPlay} />
          </div>
        ))}
      </ul>
    </>
  );
};

export default Room;
