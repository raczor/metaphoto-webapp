const config = {
    port: process.env.PORT || 3001,
    baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    cache: {
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '60'),
        checkPeriodSeconds: parseInt(process.env.CACHE_CHECK_PERIOD_SECONDS || '120'),
    }
};

export default config;