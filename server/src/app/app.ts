import { log } from '../logger';
import { LogLevels } from 'shared';

export function run() {
  log({ level: LogLevels.Debug, message: 'App is running' });
}
