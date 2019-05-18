import * as dotenv from 'dotenv';
import * as express from 'express';
import * as http from 'http';
import { LogLevels } from 'shared';
import * as socketIo from 'socket.io';
import { log } from '../logger';

export function bootstrap() {
  dotenv.config();

  const app = express();
  const server = new http.Server(app);

  const io = socketIo(server);
  io.on('connection', socket => {
    log({ level: LogLevels.Debug, message: 'A user connected' });
  });

  const port = process.env.SERVER_PORT;
  server.listen(port, () =>
    log({
      level: LogLevels.Debug,
      message: `Example app listening on port ${port}!`,
    })
  );
}
