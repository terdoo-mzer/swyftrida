import redis from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const SESSION_PREFIX = 'session:';
const SESSION_TTL = parseInt(process.env.SESSION_TTL_SECONDS) || 1800; // Default to 30 minutes if not set;

const buildKey = (phone) => `${SESSION_PREFIX}${phone}`; 

// createSession
export const createSession = async(phone, data) => {
    const key = buildKey(phone);
    const value = JSON.stringify(data);
    await redis.set(key, value, 'EX', SESSION_TTL);
}

// getSession
export const getSession = async(phone) => {
    const key = buildKey(phone);
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null;
}

// setSession
export const setSession = async(phone, data) => {
    const key = buildKey(phone);
    const value = JSON.stringify(data);
    await redis.set(key, value, 'EX', SESSION_TTL);
}

// updateSession
export const updateSession = async(phone, data) => {

    // First get session data
     const key = buildKey(phone);
     const existingSessionData = await getSession(phone);

    // Then update with new data if session exists
    if(!existingSessionData) return null;
    await redis.set(key, JSON.stringify({...existingSessionData, ...data}), 'EX', SESSION_TTL)

}

// clearSession
export const clearSession = async(phone) => {
    const key = buildKey(phone);
    await redis.del(key);
}

