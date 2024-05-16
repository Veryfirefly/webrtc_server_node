import * as express from "express";
import * as server from "http";

import { config } from './utils/config';
import { configureLog4js, bindExpressLogger, moment } from "./utils/log";
import { ApiRouter } from './express/router/api-router';
import { beforeInitDatabase } from './database/async-sqlite';

const app: express.Express = express();
const appServer = server.createServer(app);
const apiRouter: ApiRouter = new ApiRouter();

configureLog4js(config);
bindExpressLogger(app);
beforeInitDatabase(config);

app.use(express.json());
app.use('', apiRouter.router);
appServer.listen(config.listenPort, () => {
    moment.info(`The moment server is starting (port: ${config.listenPort})...`);
});
