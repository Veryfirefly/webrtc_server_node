import * as NodeCache from 'node-cache';

export const cache = new NodeCache();

export const tokenKey = (key: string): string => {
    return `token:${key}`;
}

export const principalKey = (key: string): string => {
    return `principal:${key}`;
}
