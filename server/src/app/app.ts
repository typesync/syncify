import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as express from 'express';
import * as globCb from 'glob';
import * as http from 'http';
import { LogLevels } from 'shared';
import { promisify } from 'util';
import { log } from '../logger';
import * as bodyParser from 'body-parser';

const glob = promisify(globCb);

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
  app.use('/movies', express.static('movies'));

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

  const rooms = new Map<string, {}>();
  app.post('/room', async (req, res) => {
    const roomId = crypto.randomBytes(16).toString('hex');
    rooms.set(roomId, req.body);
    log({
      level: LogLevels.Debug,
      message: `room ${roomId} created: ${JSON.stringify(rooms.get(roomId))}}`,
    });
    res.send({ roomId });
  });
}
