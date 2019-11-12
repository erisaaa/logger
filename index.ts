import { Erisa, MiddlewareHandler } from 'erisa';
import * as c from 'colorette';

type DefaultListener =
  | 'ready'
  | 'error'
  | 'warn'
  | 'guildCreate'
  | 'guildDelete';
export interface LoggerLevel {
  tagText: string;
  textFunc(text: string): string;
}
export interface Logger {
  dispatch(level: string, ...msgs: any[]);
  levels: { [x: string]: LoggerLevel };
}

declare module 'erisa' {
  interface Erisa {
    logger: Logger;
  }
}

/**
 * Register's a logger under Erisa, and optionally makes default listeners.
 *
 * @param erisa An Erisa instance to define extensions for..
 * @param defaultListeners Whether or not to register a listener for some default events. If an array, it is an array of events to log, with the values being a `DefaultListener`.
 */
export default function logger(
  // TODO: fix fuckery in main package so I don't have to typeof
  erisa: Erisa,
  defaultListeners: boolean | DefaultListener[] = true
) {
  if (erisa.logger) return;

  const _logger = (erisa.logger = {
    dispatch(level: string, ...msgs: any[]) {
      if (!this.levels[level]) console.log(...msgs);
      else {
        const lvl: LoggerLevel = this.levels[level];

        console.log(lvl.tagText, ...msgs.map(m => lvl.textFunc(m)));
      }
    },
    levels: {
      error: {
        tagText: c.bgRed('[ERROR]'),
        textFunc: str => c.red(c.bold(str))
      },
      warn: {
        tagText: c.black(c.bgYellow('[WARN]')),
        textFunc: str => c.yellow(c.bold(str))
      },
      info: {
        tagText: c.black(c.bgGreen('[INFO]')),
        textFunc: str => c.green(c.bold(str))
      }
    } as { [x: string]: LoggerLevel }
  });

  if (!defaultListeners) return;
  else
    return ([
      [
        'ready',
        ({ erisa: { user } }) =>
          _logger.dispatch('info', `Logged in as ${user.username}`)
      ],
      [
        'error',
        (_, err, id) =>
          _logger.dispatch('error', `Discord error for shard ${id}: ${err}`)
      ],
      [
        'warn',
        (_, warn, id) =>
          _logger.dispatch('warn', `Discord warning for shard ${id}: ${warn}`)
      ],
      [
        'guildCreate',
        (_, guild) =>
          _logger.dispatch('info', `Joined guild ${guild.name} (${guild.id})`)
      ],
      [
        'guildDelete',
        (_, guild) =>
          _logger.dispatch('info', `Left guild ${guild.name} (${guild.id})`)
      ]
    ] as [string, MiddlewareHandler][]).filter(
      ([event]) =>
        defaultListeners === true ||
        defaultListeners.includes(event as DefaultListener)
    );
}
