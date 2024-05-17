import { join } from "path";
import { existsSync, readFileSync } from "fs";

export declare interface Config {
    databaseDir: string,
    schemaPath: string,
    listenPort: number,
    logConfig: string,
    tokenSecretKey: string
}

export const config: Config = readConfig();

function readConfig(): Config {
    const configPath: string = join(process.cwd(), 'config');
    if (!existsSync(configPath)) {
        throw new Error('Moment server configuration file does not exist.');
    }

    const strConfig: string = readFileSync(join(configPath, 'config.json'), 'utf-8');
    const serializeConfig = JSON.parse(strConfig)

    return {
      databaseDir: notEmpty(serializeConfig, 'database.file'),
      schemaPath: notEmpty(serializeConfig, 'schema.file'),
      listenPort: notEmpty(serializeConfig, 'listen.port'),
      logConfig: notEmpty(serializeConfig, 'log4js.file'),
      tokenSecretKey: notEmpty(serializeConfig, 'token.secret.key')
    };
}

function notEmpty(config: any, key: string): any {
    const value = config[key];
    if (!value) {
        throw new Error(`The '${key}' not exists in configuration, please config it.`);
    }
    return value;
}
