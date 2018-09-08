# Erisa Logger
[![Build Status](https://travis-ci.org/erisaaa/logger.svg?branch=master)](https://travis-ci.org/erisaaa/logger)
[![Maintainability](https://api.codeclimate.com/v1/badges/eddece01869c34aa4c92/maintainability)](https://codeclimate.com/github/erisaaa/logger/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/eddece01869c34aa4c92/test_coverage)](https://codeclimate.com/github/erisaaa/logger/test_coverage)
[![npm](https://img.shields.io/npm/v/@erisa/logger.svg)](https://npmjs.com/package/@erisa/logger)

A simple logging system for the [Erisa](https://github.com/erisaaa/erisa) framework, to easily log events with colours.

## Usage
The most basic usage of the logger is just attaching it to your Erisa instance via `client.use`, as such:
```ts
import {Erisa} from 'erisa';
import logger from '@erisa/logger';

const bot = new Erisa('token');

bot.use(logger(erisa));
```
This will setup the logger to listen to it default events, which are: `ready`, `error`, `warn`, `guildCreate`, `guildDelete`. It'll also show these with different colours, depending on the "severity" of the event, e.g. red for error, yellow for warn, green for ready.

Optionally, you can select what events to listen to:
```ts
import {Erisa} from 'erisa';
import logger from '@erisa/logger';

const bot = new Erisa('token');

bot.use(logger(erisa, [
    'ready',
    'error',
    'warn'
]));
```
...or even disable the default listener altogether, and just use it as you wish.
```ts
import {Erisa} from 'erisa';
import logger from '@erisa/logger';

const bot = new Erisa('token');

bot.use(logger(erisa, false));
```
The logger attaches an object to the Erisa instance which you can use to log to the console remotely using the inbuilt levels, or even add your own level to use that from the logger.
```ts
import {Erisa} from 'erisa';
import logger from '@erisa/logger';
import {bold, bgMagenta, magenta} from 'colorette'; // Used for colouring

const bot = new Erisa('token');

bot.use(logger(erisa));

bot.extensions.logger.dispatch('info', 'Calling this from wherever I want!');

bot.extensions.logger.levels.custom = {
    tagText: bgMagenta('[CUSTOM]'),
    tagFunc: str => magenta(bold(str))
};

bot.extensions.logger('custom', 'Woohoo, custom colors!');
```

## I found a bug or want to request a feature
Open an issue [here](https://github.com/erisaaa/logger/issues), making sure that no duplicate issues exist already (unless you believe your situation to be different enough to warrant a new issue).

## Contributing
For further contribution, guidelines see [CONTRIBUTING](.github/CONTRIBUTING.md).

## License
This repository is licensed under the MIT license. More info can be found in the [LICENSE file](/LICENSE).
