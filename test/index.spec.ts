import { Erisa, MiddlewareHandler } from 'erisa';

import logger, { LoggerLevel } from '../index';

import { testString, customLevel, logEvents } from './consts';

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

const client = new Erisa('');
client.use(logger(client));

const logger_ = client.logger;

describe('printing default levels', () => {
  test.each(Object.entries(logger_.levels))('%s', (level, colourer) => {
    logger_.dispatch(level, testString);

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(
      colourer.tagText,
      colourer.textFunc(testString)
    );
  });
});

test('prints regular text on a non-existent level', () => {
  logger_.dispatch('foo', testString);
  expect(console.log).toBeCalledWith(testString);
});

test('runs any custom added levels', () => {
  const level = (logger_.levels.foo = customLevel);

  logger_.dispatch('foo', testString);
  expect(console.log).toBeCalledWith(level.tagText, level.textFunc(testString));
});

describe('defaultListeners', () => {
  test("doesn't return a middleware when false", () => {
    const tmp = new Erisa('');

    expect(logger(tmp, false)).toBe(undefined);
    expect(tmp.logger).not.toBe(undefined);
  });

  describe('logging events', () => {
    const client2 = new Erisa('');
    const events = logger(client2)!;

    test.each(Object.entries(logEvents))(
      '%s',
      (event, [before, args, expected, level]) => {
        const colourer = client2.logger.levels[level];
        const [, caller] = events.find(([eventName]) => eventName === event)!;

        before(client2);
        caller({ erisa: client2, event }, ...args);

        expect(console.log).toBeCalledTimes(1);
        expect(console.log).toBeCalledWith(
          colourer.tagText,
          colourer.textFunc(expected)
        );
      }
    );
  });
});
