import { existsSync } from 'fs';
import { configure, connectLogger, getLogger, Logger } from 'log4js';
import { Express } from 'express';

import { Config } from './config';

export function bindExpressLogger(server: Express): void {
    server.use(connectLogger(getLogger('express'), {}));
    moment.info('Access logger bound to Express server.');
}

export function configureLog4js(config: Config) {
    if (!existsSync(config.logConfig)) {
        throw new Error(`The configuration file for log4js cannot be found: ${config.logConfig}.`);
    }

    configure(config.logConfig);
}

export const moment: Logger = getLogger('moment');
export const express: Logger = getLogger('express');
