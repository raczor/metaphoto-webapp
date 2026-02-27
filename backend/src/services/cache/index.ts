import { ICacheService } from './cache.interface';
import { MemoryCacheService } from './memory-cache.service';

const cacheService: ICacheService = new MemoryCacheService();

export default cacheService;