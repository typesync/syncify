import * as dotenv from 'dotenv';
import * as express from 'express';
import { LogLevels } from 'shared';
import { log } from '../logger';

export function bootstrap() {
  dotenv.config();

  const app = express();
  const port = process.env.PORT;

  app.use(express.static(`${__dirname}/../../../client/build`));

  app.listen(port, () =>
    log({
      level: LogLevels.Debug,
      message: `Example app listening on port ${port}!`,
    })
  );
}
