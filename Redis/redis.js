const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_PORT_NUMBER);

const set = async (key, value) => {
    await redisClient.set(key, JSON.stringify(value));
}

const get = async (key) => {
    return await redisClient.get(key);
}

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connection');
    } catch (err) {
        console.error('Redis disconnection:', err);
    }
})();

module.exports = {redisClient, set, get};