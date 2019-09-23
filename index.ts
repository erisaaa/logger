import { Erisa, MiddlewareHandler } from 'erisa';
import * as c from 'colorette';

type DefaultListeners =
  | 'ready'
  | 'error'
  | 'warn'
  | 'guildCreate'
  | 'guildDelete';
export interface LoggerLevel {
  tagText: string;
  textFunc(text: string): string;
}

/**
 * Register's a logger under Erisa, and optionally makes default listeners.
 *
 * @param erisa An Erisa instance to define extensions for..
 * @param defaultListeners Whether or not to register a listener for some default events. If an array, it is an array of events to log, with the values being a `DefaultListeners`.
 */
export default function logger(
  erisa: Erisa,
  defaultListeners: boolean | DefaultListeners[] = true
): MiddlewareHandler | void {
  if (erisa.extensions.logger) return;

  erisa.extensions.logger = {
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
  };

  if (!defaultListeners) return;
  else
    return function handler({ erisa: client, event }, ...args) {
      if (
        Array.isArray(defaultListeners) &&
        !defaultListeners.includes(event as DefaultListeners)
      )
        return;

      const logger_ = client.extensions.logger;

      /* if (!defaultListeners) return;
    else return ([
        ['ready', ({erisa: {user}}) => _logger.dispatch('info', `Logged in as ${user.username}`)],
        ['error', (_, err, id) => _logger.dispatch('error', `Discord error for shard ${id}: ${err}`)],
        ['warn', (_, warn, id) => _logger.dispatch('warn', `Discord warning for shard ${id}: ${warn}`)],
        ['guildCreate', (_, guild) => _logger.dispatch('info', `Joined guild ${guild.name} (${guild.id})`)],
        ['guildDelete', (_, guild) => _logger.dispatch('info', `Left guild ${guild.name} (${guild.id})`)]
    ] as [string, MiddlewareHandler][]).filter(([event]) => defaultListeners === true || defaultListeners.includes(event as DefaultListener));
*/

      switch (event) {
        case 'ready':
          logger_.dispatch('info', `Logged in as ${client.user.username}`);
          break;
        case 'error':
          logger_.dispatch(
            'error',
            `Discord error for shard ${args[1]}: ${args[0]}`
          );
          break;
        case 'warn':
          logger_.dispatch(
            'warn',
            `Discord warning for shard ${args[1]}: ${args[0]}`
          );
          break;
        case 'guildCreate':
          logger_.dispatch(
            'info',
            `Joined guild ${args[0].name} (${args[0].id})`
          );
          break;
        case 'guildDelete':
          logger_.dispatch(
            'info',
            `Left guild ${args[0].name} (${args[0].id})`
          );
          break;
        default:
          break;
      }
    };
}
