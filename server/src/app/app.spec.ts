import { run } from './app';
import { LogLevels } from 'shared';

describe('run', () => {
  it('logs App is running', () => {
    // tslint:disable: no-console
    console.log = jest.fn();
    run();
    expect(console.log).toHaveBeenCalledWith({
      level: LogLevels.Debug,
      message: 'App is running',
    });
    // tslint:enable: no-console
  });
});
