import { RedisClientType, createClient } from 'redis';
import CacheMemoryInterface from '../Interface/cacheInterface';

class Redis extends CacheMemoryInterface {
    private redisClient: RedisClientType;

    constructor() {
        super();
        this.redisClient = createClient({ url: `redis://localhost:${process.env.REDIS_PORT_NUMBER}` });
        (async () => {
            try {
                console.log("Redis connect");
                await this.redisClient.connect();
            } catch (err) {
                console.log("Redis Error : ", err.message);
                process.exit(1);
            }
        })();
    }

    async set(key: string, value: string): Promise<void> {
        await this.redisClient.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }
}

export default Redis;
