import Eris from 'eris';
import * as c from 'colorette';
import { Erisa } from 'erisa';

// logger.test.ts
export const testString = 'This is a test.';
export const customLevel = {
  tagText: c.bgCyan('[FOO]'),
  textFunc: str => c.cyan(c.bold(testString))
};
export const logEvents: {
  [x: string]: [(client: Erisa) => any, any[], any, string];
} = {
  ready: [
    client => {
      const tmp = new Eris.ExtendedUser({ id: '420blazeit' }, client);
      tmp.username = 'Test';
      client.user = tmp;
    },
    [],
    'Logged in as Test',
    'info'
  ],
  error: [
    () => void 0,
    [new Error('Test error'), 5],
    `Discord error for shard 5: ${new Error('Test error')}`,
    'error'
  ],
  warn: [
    () => void 0,
    ['Test warning', 5],
    'Discord warning for shard 5: Test warning',
    'warn'
  ],
  guildCreate: [
    () => void 0,
    [{ name: 'Test', id: '1234567890' }],
    'Joined guild Test (1234567890)',
    'info'
  ],
  guildDelete: [
    () => void 0,
    [{ name: 'Test', id: '1234567890' }],
    'Left guild Test (1234567890)',
    'info'
  ]
};
