const redis = require('redis');
const CacheMemoryInterface = require('../Interface/cacheInterface');

class Redis extends CacheMemoryInterface {
    constructor() {
        super();
        this.redisClient = redis.createClient(process.env.REDIS_PORT_NUMBER);
        (async () => {
            try {
                await this.redisClient.connect();
            } catch (err) {
                console.log("Redis Error : ", err.message);
                process.exit(1);
            }
        })();
    }

    async set(key, value) {
        await this.redisClient.set(key, value);
    }

    async get(key) {
        return await this.redisClient.get(key);
    }

}

module.exports = Redis;