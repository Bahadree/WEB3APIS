// Upstash REST API ile Redis işlemleri için yardımcı fonksiyonlar
// .env dosyanızda UPSTASH_REDIS_REST_URL ve UPSTASH_REDIS_REST_TOKEN olmalı

const fetch = require('node-fetch');

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  console.warn('Upstash REST URL veya Token tanımlı değil!');
}

async function redisSet(key, value, expiration = 3600) {
  const url = `${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}`;
  const body = { value: JSON.stringify(value), ex: expiration };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function redisGet(key) {
  const url = `${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  const data = await res.json();
  if (data.result === null) return null;
  try {
    return JSON.parse(data.result);
  } catch {
    return data.result;
  }
}

async function redisDel(key) {
  const url = `${UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  return res.json();
}

module.exports = { redisSet, redisGet, redisDel };
