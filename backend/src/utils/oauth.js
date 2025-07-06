const { query } = require('../config/database');

// Veritabanı tabanlı API key doğrulama
async function validateApiKey(apiKey) {
  const result = await query('SELECT * FROM api_keys WHERE api_key = $1 AND is_active = true', [apiKey]);
  return result.rows.length > 0;
}

// Veritabanı tabanlı oyun bilgisi çekme
async function getGameInfoByApiKey(apiKey) {
  const result = await query(`
    SELECT g.name, g.image_url as logo, k.permissions as scopes, g.oauth_scopes
    FROM api_keys k
    JOIN games g ON k.game_id = g.id
    WHERE k.api_key = $1 AND k.is_active = true
    LIMIT 1
  `, [apiKey]);
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  // Öncelik: games.oauth_scopes > api_keys.permissions
  let scopes = [];
  if (row.oauth_scopes) {
    try {
      scopes = typeof row.oauth_scopes === 'string' ? JSON.parse(row.oauth_scopes) : row.oauth_scopes;
    } catch {
      scopes = [];
    }
  } else if (row.scopes) {
    try {
      scopes = typeof row.scopes === 'string' ? JSON.parse(row.scopes) : row.scopes;
    } catch {
      scopes = [];
    }
  }
  return {
    name: row.name,
    logo: row.logo,
    scopes
  };
}

module.exports = { validateApiKey, getGameInfoByApiKey };
