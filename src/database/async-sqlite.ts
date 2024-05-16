import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Database, Statement } from 'sqlite3';

import { moment } from "../utils/log";
import { Config } from "../utils/config";

export let dbHolder: Database;

const callback = (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    return (err: Error, row: any) => {
        if (err) {
            moment.error('An error occurred while query database.', err);
            reject(err);
        } else {
            resolve(row);
        }
    }
}

export function beforeInitDatabase(config: Config): void {
    const dbDirPath = join(process.cwd(), config.databaseDir);
    if (!existsSync(dbDirPath)) {
        mkdirSync(dbDirPath);
        moment.info(`Created database directory: ${dbDirPath}`);
    }

    dbHolder = new Database(join(dbDirPath, 'moment.db'));
    moment.info('The database has been initialized.');
}

export async function get(sql: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        dbHolder.get(sql, params, callback(resolve, reject));
    })
}

export async function all(sql: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        dbHolder.all(sql, params, callback(resolve, reject));
    })
}

export function prepare(sql: string, ...params: any[]): Statement {
    return dbHolder.prepare(sql, params);
}
