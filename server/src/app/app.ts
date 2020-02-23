import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as express from 'express';
import * as globCb from 'glob';
import * as http from 'http';
import { LogLevels, Room } from 'shared';
import { promisify } from 'util';
import { log } from '../logger';
import * as bodyParser from 'body-parser';
import * as socketServer from 'socket.io';
import * as send from 'send';
// import * as fs from 'fs';

const glob = promisify(globCb);
// const stat = promisify(fs.stat);

export function bootstrap() {
  dotenv.config();

  const app = express();
  const server = new http.Server(app);

  const port = process.env.SERVER_PORT;
  server.listen(port, () =>
    log({
      level: LogLevels.Debug,
      message: `Example app listening on port ${port}!`,
    })
  );

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  app.get('/movies', async (req, res) => {
    const movies = await glob('**/*.mp4', { cwd: 'movies' });
    if (movies && movies.length) {
      log({
        level: LogLevels.Debug,
        message: `${movies.length} movies found: ${movies.join(', ')}`,
      });
      res.send({ movies });
    } else {
      res.send({ movies: [] });
    }
  });

  // app.use('/movies', express.static('movies'));

  app.get('/movies/:name', (req, res, next) => {
    log({
      level: LogLevels.Debug,
      message: `movie ${req.params.name} requested`,
    });
    const stream = send(req, req.params.name, { root: './movies' });
    stream.pipe(res);
    stream.on('error', err => {
      log({
        level: LogLevels.Debug,
        message: `streaming failed: ${JSON.stringify(err)}`,
      });
    });
    stream.on('file', (path, stat) => {
      log({
        level: LogLevels.Debug,
        message: `streaming file requested: ${JSON.stringify(
          path
        )} ${JSON.stringify(stat)}`,
      });
    });
    stream.on('stream', s => {
      log({
        level: LogLevels.Debug,
        message: `streaming stream started: ${JSON.stringify(s)}`,
      });
    });
    stream.on('end', () => {
      log({
        level: LogLevels.Debug,
        message: 'streaming stream ended',
      });
    });
  });

  // app.get('/movies/:name', async (req, res, next) => {
  //   const { name } = req.params;
  //   const file = `./movies/${name}`;
  //   log({
  //     level: LogLevels.Debug,
  //     message: `a client requested ${file}`,
  //   });
  //   try {
  //     const movie = await stat(file);
  //     log({
  //       level: LogLevels.Debug,
  //       message: `stated ${file} successfully`,
  //     });
  //     const range = req.headers.range;
  //     log({
  //       level: LogLevels.Debug,
  //       message: `range requested: ${range}`,
  //     });
  //     if (!range) {
  //       const err: any = new Error('Wrong range');
  //       err.status = 416;
  //       return next(err);
  //     }
  //     const positions = range.replace(/bytes=/, '').split('-');
  //     const start = parseInt(positions[0], 10);
  //     const fileSize = movie.size;
  //     const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
  //     const chunksize = end - start + 1;
  //     const headers = {
  //       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  //       'Accept-Ranges': 'bytes',
  //       'Content-Length': chunksize,
  //       'Content-Type': 'video/mp4',
  //     };
  //     res.writeHead(206, headers);
  //     const streamPosition = { start, end };
  //     const stream = fs.createReadStream(file, streamPosition);
  //     stream.on('open', () => {
  //       log({
  //         level: LogLevels.Debug,
  //         message: `stream piped to response ${start}-${end}`,
  //       });
  //       stream.pipe(res);
  //     });
  //     stream.on('error', err => {
  //       return next(err);
  //     });
  //   } catch (err) {
  //     if (err.code === 'ENOENT') {
  //       res.sendStatus(404);
  //     }
  //     return next(err);
  //   }
  // });

  const rooms = new Map<string, Room>();

  app.post('/room', async (req, res) => {
    const roomId = crypto.randomBytes(16).toString('hex');
    rooms.set(roomId, req.body.room);
    log({
      level: LogLevels.Debug,
      message: `room ${roomId} created: ${JSON.stringify(rooms.get(roomId))}}`,
    });
    res.send({ roomId });
  });

  const io = socketServer(server);
  io.on('connection', socket => {
    log({ level: LogLevels.Debug, message: 'a user connected' });
    socket.on('Get Room', (roomId: string, callback: (room: Room) => void) => {
      log({ level: LogLevels.Debug, message: `Get Room: ${roomId}` });
      const room = rooms.get(roomId);
      if (room) {
        callback(room);
      }
    });
    socket.on('Play', () => {
      io.emit('Play');
    });
    socket.on('Pause', () => {
      io.emit('Pause');
    });
    socket.on('disconnect', () => {
      log({ level: LogLevels.Debug, message: `a user disconnected` });
    });
  });
}
