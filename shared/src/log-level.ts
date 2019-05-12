export type LogLevel =
  | typeof LogLevels.Error
  | typeof LogLevels.Warn
  | typeof LogLevels.Debug;

export enum LogLevels {
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
}
