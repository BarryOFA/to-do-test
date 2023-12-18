import { format, transports } from 'winston'

export const winstonLoggerConfig = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.ms(),
    format.json(),
    format.colorize({
      all: true,
      colors: { error: 'red', ERROR: 'red' },
    }),
  ),
  transports: [new transports.Console()],
}
