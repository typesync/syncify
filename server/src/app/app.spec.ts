import { bootstrap } from './app';
import { LogLevels } from 'shared';

describe('bootstrap', () => {
  it('logs App is running', () => {
    // tslint:disable: no-console
    console.log = jest.fn();
    bootstrap();
    expect(console.log).toHaveBeenCalledWith({
      level: LogLevels.Debug,
      message: 'App is running',
    });
    // tslint:enable: no-console
  });
});
