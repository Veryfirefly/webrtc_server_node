import * as NodeCache from 'node-cache';

export const cache = new NodeCache();

// expiration 30day.
export const defaultExpireTime: number = 30 * 24 * 60 * 60;

export const tokenKey = (key: string): string => {
    return `token:${key}`;
}

export const principalKey = (key: string): string => {
    return `principal:${key}`;
}
