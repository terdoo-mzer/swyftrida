import Redis from "ioredis"

import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 19478,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    reconnectOnError: (err) => {
        console.error('Redis reconnecting due to error:', err);
        return true;
    }
});

// TCP connection is establlished and ready to use
redis.on("connect", () => {
    console.log("Redis connected");
});

// Redis client is ready to use (after authentication and other setup)
redis.on("ready", () => {
    console.log("Redis ready");
});

redis.on("error", (err) => {
    console.error(
        "Redis Error:",
        err
    );
});

export default redis;
