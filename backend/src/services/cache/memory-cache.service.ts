import NodeCache from 'node-cache';
import config from '../../configs/config';
import { ICacheService } from './cache.interface';
import logger from "../../utils/logger";

export class MemoryCacheService implements ICacheService {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({
            stdTTL: config.cache.ttlSeconds,
            checkperiod: config.cache.checkPeriodSeconds,
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = this.cache.get<T>(key) ?? null;
            logger.debug(`[Cache] ${value ? 'HIT' : 'MISS'} key=${key}`);
            return value;
        } catch (err) {
            logger.error(`[Cache] GET failed key=${key}`, err);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            this.cache.set(key, value);
            logger.debug(`[Cache] SET key=${key}`);
        } catch (err) {
            logger.error(`[Cache] SET failed key=${key}`, err);
        }
    }

    async invalidate(key: string): Promise<void> {
        try {
            this.cache.del(key);
            logger.info(`[Cache] INVALIDATED key=${key}`);
        } catch (err) {
            logger.error(`[Cache] INVALIDATE failed key=${key}`, err);
        }
    }

    async invalidateAll(): Promise<void> {
        try {
            this.cache.flushAll();
            logger.info('[Cache] INVALIDATED all keys');
        } catch (err) {
            logger.error('[Cache] INVALIDATE ALL failed', err);
        }
        }
}