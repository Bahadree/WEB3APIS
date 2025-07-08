const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { validateApiKey, getGameInfoByApiKey } = require('../utils/oauth');
const auth = require('../middleware/auth');
const axios = require('axios');
const { query } = require('../config/database');
const jwt = require('jsonwebtoken');

// 1. Oyun API key ile request_token alır
router.post('/request', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'API key is required' });
  const isValid = await validateApiKey(apiKey);
  if (!isValid) return res.status(401).json({ error: 'Invalid API key' });
  const info = await getGameInfoByApiKey(apiKey);
  if (!info) return res.status(404).json({ error: 'Game not found' });
  const allowedScopes = info.scopes || [];
  let finalScopes = allowedScopes;
  if (!Array.isArray(finalScopes) || finalScopes.length === 0) {
    return res.status(400).json({ error: 'No scopes available for this API key' });
  }
  // Token üret
  const requestToken = crypto.randomBytes(32).toString('hex');
  // Tokenı ve istek bilgilerini DB'ye kaydet (şimdilik memory)
  global.oauthRequests = global.oauthRequests || {};
  global.oauthRequests[requestToken] = {
    apiKey,
    scopes: finalScopes,
    createdAt: Date.now(),
    authorized: false,
    userId: null
  };
  res.json({ request_token: requestToken, expires_in: 300 }); // 5 dk (300 sn)
});

// 2. Kullanıcı izin verirse request_token'ı authorize et
router.post('/authorize', auth, async (req, res) => {
  const { request_token } = req.body;
  if (!request_token) return res.status(400).json({ error: 'Missing params' });
  const reqData = global.oauthRequests && global.oauthRequests[request_token];
  if (!reqData) return res.status(400).json({ error: 'Invalid request token' });
  // 5 dk kontrolü
  if (Date.now() - reqData.createdAt > 5 * 60 * 1000) {
    return res.status(410).json({ error: 'Request token expired' });
  }
  reqData.authorized = true;
  reqData.userId = req.user.userId;
  res.json({ success: true });
});

// 3. Oyun access_token almak isterse (JWT gereksiz)
router.post('/token', async (req, res) => {
  const { request_token } = req.body;
  if (!request_token) return res.status(400).json({ error: 'Missing params' });
  const reqData = global.oauthRequests && global.oauthRequests[request_token];
  if (!reqData || !reqData.authorized || !reqData.userId) {
    return res.status(403).json({ error: 'Request token not authorized by user' });
  }
  // 5 dk kontrolü
  if (Date.now() - reqData.createdAt > 5 * 60 * 1000) {
    return res.status(410).json({ error: 'Request token expired' });
  }
  // --- SCOPES CHECK ---
  const info = await getGameInfoByApiKey(reqData.apiKey);
  if (!info) return res.status(404).json({ error: 'Game not found' });
  const allowedScopes = info.scopes || [];
  let finalScopes = reqData.scopes;
  if (typeof finalScopes === "string") {
    try {
      finalScopes = JSON.parse(finalScopes);
    } catch {
      finalScopes = finalScopes.split(",").map(s => s.trim());
    }
  }
  if (!Array.isArray(finalScopes)) finalScopes = [];
  if (finalScopes.length === 0) {
    return res.status(400).json({ error: 'No scopes available for this API key' });
  }
  const notAllowed = finalScopes.filter(scope => !allowedScopes.includes(scope));
  if (notAllowed.length > 0) {
    return res.status(403).json({ error: `API key does not have required scopes: ${notAllowed.join(', ')}` });
  }
  // Access token üret
  const accessToken = crypto.randomBytes(32).toString('hex');
  global.oauthAccessTokens = global.oauthAccessTokens || {};
  global.oauthAccessTokens[accessToken] = {
    apiKey: reqData.apiKey,
    userId: reqData.userId,
    allowedScopes: finalScopes,
    createdAt: Date.now()
  };
  res.json({ access_token: accessToken });
});

// Oyun bilgisi döndür (isim, logo)
router.get('/gameinfo', async (req, res) => {
  const { apiKey } = req.query;
  if (!apiKey) return res.status(400).json({ error: 'API key is required' });
  const info = await getGameInfoByApiKey(apiKey);
  if (!info) return res.status(404).json({ error: 'Game not found' });
  res.json(info);
});

// Kullanıcı bu oyuna daha önce giriş yapmış mı kontrol et
router.get('/check', async (req, res) => {
  const { apiKey, userId } = req.query;
  if (!apiKey || !userId) return res.status(400).json({ error: 'apiKey ve userId gerekli' });
  // Tüm access_token'ları tara
  const tokens = global.oauthAccessTokens || {};
  for (const [accessToken, data] of Object.entries(tokens)) {
    if (data.apiKey === apiKey && data.userId === userId) {
      return res.json({
        access_token: accessToken,
        allowedScopes: data.allowedScopes,
        createdAt: data.createdAt
      });
    }
  }
  res.status(404).json({ error: 'Kullanıcı bu oyuna daha önce giriş yapmamış.' });
});

// Kullanıcı verisini access_token ile döndür
router.get('/userdata', async (req, res) => {
  const { access_token } = req.query;
  if (!access_token) return res.status(400).json({ error: 'access_token gerekli' });
  global.oauthAccessTokens = global.oauthAccessTokens || {};
  const tokenData = global.oauthAccessTokens[access_token];
  if (!tokenData) return res.status(401).json({ error: 'Geçersiz access_token' });
  const userId = tokenData.userId;
  try {
    const { query } = require('../config/database');
    const result = await query(
      'SELECT id, email, username, avatar_url FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    // Sadece yetkili scope'lara göre veri döndür
    const user = result.rows[0];
    const allowed = tokenData.allowedScopes || [];
    const filtered = {};
    if (allowed.includes('email')) filtered.email = user.email;
    if (allowed.includes('username')) filtered.username = user.username;
    if (allowed.includes('avatar')) filtered.avatar_url = user.avatar_url;
    filtered.id = user.id;
    return res.json({ user: filtered });
  } catch (e) {
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Request token ile uygulama ve scope bilgisini döndür
router.get('/requestinfo', async (req, res) => {
  const { request_token } = req.query;
  if (!request_token) return res.status(400).json({ error: 'request_token gerekli' });
  global.oauthRequests = global.oauthRequests || {};
  const reqData = global.oauthRequests[request_token];
  if (!reqData) return res.status(404).json({ error: 'Geçersiz request_token' });
  // 5 dk kontrolü
  if (Date.now() - reqData.createdAt > 5 * 60 * 1000) {
    return res.status(410).json({ error: 'Request token expired' });
  }
  const info = await getGameInfoByApiKey(reqData.apiKey);
  if (!info) return res.status(404).json({ error: 'Game not found' });
  res.json({
    game: { name: info.name, logo: info.logo },
    scopes: reqData.scopes || [],
    expires_in: 300
  });
});

// Google OAuth callback: kodu frontend'e yönlendir
router.get('/google/callback', (req, res) => {
  const code = req.query.code;
  const frontendCallback = `${process.env.FRONTEND_URL}/auth/google/callback?code=${code}`;
  return res.redirect(frontendCallback);
});

// Frontendden kodu alıp Google'dan token ve user info çek, kaydet, JWT döndür
router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });
  try {
    // Google'dan access token al
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`,
      grant_type: 'authorization_code',
    });
    const { access_token, id_token } = tokenRes.data;
    // Google'dan user info al
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const googleUser = userRes.data;
    // Kullanıcıyı DB'ye kaydet veya güncelle
    let user = null;
    const userResult = await query('SELECT * FROM users WHERE email = $1', [googleUser.email]);
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
    } else {
      const insertResult = await query(
        'INSERT INTO users (email, username, full_name, avatar_url, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          googleUser.email,
          googleUser.email.split('@')[0],
          googleUser.name,
          googleUser.picture,
          true,
        ]
      );
      user = insertResult.rows[0];
    }
    // OAuth provider tablosuna ekle
    await query(
      `INSERT INTO oauth_providers (user_id, provider, provider_id, provider_email, provider_data)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (provider, provider_id) DO NOTHING`,
      [user.id, 'google', googleUser.sub, googleUser.email, JSON.stringify(googleUser)]
    );
    // JWT oluştur
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error('Google OAuth error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Google OAuth failed' });
  }
});

module.exports = router;
