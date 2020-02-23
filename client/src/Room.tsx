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
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [playlist, setPlaylist] = useState([] as string[]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!socket) {
      const s = io(`${process.env.REACT_APP_API_URL}`);
      s.on('connect', () => {
        setSocket(s);
      });
      s.on('disconnect', () => {
        setSocket(undefined);
      });
    } else {
      socket.emit('Get Room', roomId, (room: RoomModel) => {
        setPlaylist(room.playlist);
      });
      socket.on('Play', () => {
        console.log('client socket on play');
        setPlaying(true);
      });
      socket.on('Pause', () => {
        console.log('client socket on pause');
        setPlaying(false);
      });
    }
  }, [socket, roomId]);

  const emitPlay = () => {
    if (socket) {
      console.log('client socket emit play');
      socket.emit('Play', roomId);
    }
  };

  const emitPause = () => {
    if (socket) {
      console.log('client socket emit pause');
      socket.emit('Pause', roomId);
    }
  };

  return (
    <>
      <h2>Room {roomId}</h2>
      <ul>
        {playlist.map(movie => (
          <div key={movie}>
            <h3>playlist item</h3>
            <Movie
              key={movie}
              src={movie}
              onPlay={emitPlay}
              onPause={emitPause}
              playing={playing}
            />
          </div>
        ))}
      </ul>
    </>
  );
};

export default Room;
