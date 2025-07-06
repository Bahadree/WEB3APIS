const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Create a new game/project
router.post('/projects', auth, [
  body('name').isLength({ min: 3, max: 255 }).trim(),
  body('description').optional().trim(),
  body('websiteUrl').optional().isURL(),
  body('gameType').optional().isIn(['p2p', 'mmo', 'strategy', 'action', 'puzzle', 'other']),
  body('webhookUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, description, websiteUrl, gameType, webhookUrl } = req.body;

    // Generate API key
    const apiKey = `gk_${crypto.randomBytes(32).toString('hex')}`;

    const result = await query(`
      INSERT INTO games (
        name, description, developer_id, website_url, 
        game_type, api_key, webhook_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, description, req.user.userId, websiteUrl, gameType, apiKey, webhookUrl]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: result.rows[0] }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get developer's projects
router.get('/projects', auth, async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, description, website_url, game_type, image_url, 
             api_key, is_active, is_verified, created_at, updated_at
      FROM games 
      WHERE developer_id = $1
      ORDER BY created_at DESC
    `, [req.user.userId]);

    res.json({
      success: true,
      data: { projects: result.rows }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get project details
router.get('/projects/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT * FROM games 
      WHERE id = $1 AND developer_id = $2
    `, [id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get API keys for this project
    const apiKeysResult = await query(`
      SELECT id, key_name, api_key, permissions, rate_limit, 
             is_active, last_used_at, expires_at, created_at
      FROM api_keys
      WHERE game_id = $1
    `, [id]);

    // Get OAuth applications for this project
    const oauthAppsResult = await query(`
      SELECT id, app_name, client_id, client_secret, 
             redirect_uris, scopes, is_active, created_at
      FROM oauth_applications
      WHERE game_id = $1
    `, [id]);

    const project = {
      ...result.rows[0],
      apiKeys: apiKeysResult.rows.map((k) => ({
        ...k,
        permissions: typeof k.permissions === 'string' ? JSON.parse(k.permissions) : k.permissions
      })),
      oauthApplications: oauthAppsResult.rows
    };

    res.json({
      success: true,
      data: { project }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create API key for a project
router.post('/projects/:id/api-keys', auth, [
  body('keyName').isLength({ min: 3, max: 255 }).trim(),
  body('permissions').optional().isArray(),
  body('rateLimit').optional().isInt({ min: 1, max: 10000 }),
  body('expiresAt').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { keyName, permissions = [], rateLimit = 1000, expiresAt } = req.body;

    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM games WHERE id = $1 AND developer_id = $2',
      [id, req.user.userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Generate API key and secret
    const apiKey = `ak_${crypto.randomBytes(24).toString('hex')}`;
    const apiSecret = `sk_${crypto.randomBytes(32).toString('hex')}`;

    const result = await query(`
      INSERT INTO api_keys (
        user_id, game_id, key_name, api_key, api_secret, 
        permissions, rate_limit, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, key_name, api_key, api_secret, permissions, 
               rate_limit, is_active, expires_at, created_at
    `, [req.user.userId, id, keyName, apiKey, apiSecret, JSON.stringify(permissions), rateLimit, expiresAt]);

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: { apiKey: result.rows[0] }
    });

  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create OAuth application
router.post('/projects/:id/oauth-apps', auth, [
  body('appName').isLength({ min: 3, max: 255 }).trim(),
  body('redirectUris').isArray(),
  body('scopes').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { appName, redirectUris, scopes = ['read', 'write'] } = req.body;

    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM games WHERE id = $1 AND developer_id = $2',
      [id, req.user.userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Generate client ID and secret
    const clientId = `client_${crypto.randomBytes(16).toString('hex')}`;
    const clientSecret = `secret_${crypto.randomBytes(32).toString('hex')}`;

    const result = await query(`
      INSERT INTO oauth_applications (
        user_id, game_id, app_name, client_id, client_secret,
        redirect_uris, scopes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, app_name, client_id, client_secret, 
               redirect_uris, scopes, is_active, created_at
    `, [req.user.userId, id, appName, clientId, clientSecret, JSON.stringify(redirectUris), JSON.stringify(scopes)]);

    res.status(201).json({
      success: true,
      message: 'OAuth application created successfully',
      data: { oauthApp: result.rows[0] }
    });

  } catch (error) {
    console.error('Create OAuth app error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update project
router.put('/projects/:id', auth, [
  body('name').optional().isLength({ min: 3, max: 255 }).trim(),
  body('description').optional().trim(),
  body('websiteUrl').optional().isURL(),
  body('logoUrl').optional().isURL(),
  body('webhookUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, description, websiteUrl, logoUrl, webhookUrl } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (websiteUrl !== undefined) {
      updateFields.push(`website_url = $${paramCount}`);
      values.push(websiteUrl);
      paramCount++;
    }

    if (logoUrl !== undefined) {
      updateFields.push(`logo_url = $${paramCount}`);
      values.push(logoUrl);
      paramCount++;
    }

    if (webhookUrl !== undefined) {
      updateFields.push(`webhook_url = $${paramCount}`);
      values.push(webhookUrl);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.user.userId, id);

    const result = await query(`
      UPDATE games 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE developer_id = $${paramCount} AND id = $${paramCount + 1}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project: result.rows[0] }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get project analytics
router.get('/projects/:id/analytics', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM games WHERE id = $1 AND developer_id = $2',
      [id, req.user.userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get session statistics
    const sessionsResult = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_session_minutes,
        SUM(earnings_amount) as total_earnings_distributed
      FROM game_sessions 
      WHERE game_id = $1 AND ended_at IS NOT NULL
    `, [id]);

    // Get active users over time (last 30 days)
    const activeUsersResult = await query(`
      SELECT 
        DATE(started_at) as date,
        COUNT(DISTINCT user_id) as active_users
      FROM game_sessions 
      WHERE game_id = $1 AND started_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(started_at)
      ORDER BY date
    `, [id]);

    // Get NFT statistics
    const nftStats = await query(`
      SELECT 
        COUNT(*) as total_nfts,
        COUNT(DISTINCT user_id) as unique_nft_owners,
        AVG(price) as avg_nft_price
      FROM nfts 
      WHERE game_id = $1
    `, [id]);

    const analytics = {
      sessions: sessionsResult.rows[0],
      activeUsers: activeUsersResult.rows,
      nfts: nftStats.rows[0]
    };

    res.json({
      success: true,
      data: { analytics }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Regenerate API key
router.post('/projects/:projectId/api-keys/:keyId/regenerate', auth, async (req, res) => {
  try {
    const { projectId, keyId } = req.params;

    // Verify ownership
    const keyResult = await query(`
      SELECT ak.id FROM api_keys ak
      JOIN games g ON ak.game_id = g.id
      WHERE ak.id = $1 AND g.id = $2 AND g.developer_id = $3
    `, [keyId, projectId, req.user.userId]);

    if (keyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    // Generate new keys
    const newApiKey = `ak_${crypto.randomBytes(24).toString('hex')}`;
    const newApiSecret = `sk_${crypto.randomBytes(32).toString('hex')}`;

    const result = await query(`
      UPDATE api_keys 
      SET api_key = $1, api_secret = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, key_name, api_key, api_secret, permissions, rate_limit, is_active
    `, [newApiKey, newApiSecret, keyId]);

    res.json({
      success: true,
      message: 'API key regenerated successfully',
      data: { apiKey: result.rows[0] }
    });

  } catch (error) {
    console.error('Regenerate API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset API key for a project
router.post('/projects/:id/api-keys/reset', auth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { permissions = [] } = req.body;
    // Sadece projenin sahibi resetleyebilsin
    const projectResult = await query(
      `SELECT * FROM games WHERE id = $1 AND developer_id = $2`,
      [projectId, req.user.userId]
    );
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Kullanıcıya ve projeye ait tüm anahtarları sil
    await query(
      `DELETE FROM api_keys WHERE game_id = $1 AND user_id = $2`,
      [projectId, req.user.userId]
    );

    // Yeni anahtar ve secret üret
    const newApiKey = `gk_${crypto.randomBytes(32).toString('hex')}`;
    const newApiSecret = `sk_${crypto.randomBytes(32).toString('hex')}`;
    const keyName = `${projectResult.rows[0].name} Key`;

    // Yeni anahtarı ekle (permissions ile)
    const insertResult = await query(
      `INSERT INTO api_keys (user_id, game_id, key_name, api_key, api_secret, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id, key_name, api_key, is_active, created_at`,
      [req.user.userId, projectId, keyName, newApiKey, newApiSecret, JSON.stringify(permissions)]
    );

    res.json({
      success: true,
      data: { apiKey: insertResult.rows[0] }
    });
  } catch (error) {
    console.error('API key reset error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API anahtarı silme
router.delete('/projects/:projectId/api-keys/:keyId', auth, async (req, res) => {
  try {
    const { projectId, keyId } = req.params;
    // Sadece projenin sahibi silebilsin
    const keyResult = await query(
      `SELECT ak.id FROM api_keys ak JOIN games g ON ak.game_id = g.id WHERE ak.id = $1 AND g.id = $2 AND g.developer_id = $3`,
      [keyId, projectId, req.user.userId]
    );
    if (keyResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }
    await query(`DELETE FROM api_keys WHERE id = $1`, [keyId]);
    res.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Web3APIs Developer Documentation',
    data: {
      endpoints: {
        authentication: {
          '/api/auth/login': 'POST - User login',
          '/api/auth/register': 'POST - User registration',
          '/api/auth/wallet-auth': 'POST - Web3 wallet authentication'
        },
        users: {
          '/api/users/profile': 'GET/PUT - User profile management',
          '/api/users/wallets': 'GET/POST - Wallet management',
          '/api/users/dashboard': 'GET - Dashboard statistics'
        },
        nfts: {
          '/api/nfts': 'GET - User NFTs',
          '/api/nfts/:id': 'GET - NFT details',
          '/api/nfts/:id/list': 'POST/DELETE - NFT marketplace listing',
          '/api/nfts/marketplace/browse': 'GET - Browse marketplace'
        },
        development: {
          '/api/dev/projects': 'GET/POST - Project management',
          '/api/dev/projects/:id/api-keys': 'POST - Create API keys',
          '/api/dev/projects/:id/oauth-apps': 'POST - Create OAuth apps'
        }
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer <your-token>'
      },
      rateLimit: {
        default: '100 requests per 15 minutes',
        authenticated: '1000 requests per hour'
      }
    }
  });
});

// Save OAuth scopes for a project
router.post('/projects/:id/oauth-scopes', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { scopes } = req.body;
    if (!Array.isArray(scopes)) {
      return res.status(400).json({ success: false, message: 'Scopes array required' });
    }
    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM games WHERE id = $1 AND developer_id = $2',
      [id, req.user.userId]
    );
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    // Save scopes to games table (add a column if yoksa: ALTER TABLE games ADD COLUMN oauth_scopes text)
    await query(
      'UPDATE games SET oauth_scopes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(scopes), id]
    );
    res.json({ success: true, message: 'OAuth scopes updated' });
  } catch (error) {
    console.error('Save OAuth scopes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get OAuth scopes for a project
router.get('/projects/:id/oauth-scopes', auth, async (req, res) => {
  try {
    const { id } = req.params;
    // Proje sahipliği kontrolü
    const projectResult = await query(
      'SELECT oauth_scopes FROM games WHERE id = $1 AND developer_id = $2',
      [id, req.user.userId]
    );
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    let scopes = [];
    const raw = projectResult.rows[0].oauth_scopes;
    if (raw) {
      try {
        scopes = JSON.parse(raw);
      } catch {
        scopes = [];
      }
    }
    res.json({ success: true, scopes });
  } catch (error) {
    console.error('Get OAuth scopes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API anahtarı yetkilerini güncelle
router.put('/projects/:projectId/api-keys/:keyId', auth, async (req, res) => {
  try {
    const { projectId, keyId } = req.params;
    const { permissions } = req.body;
    if (!permissions) {
      return res.status(400).json({ success: false, message: 'Permissions required' });
    }
    // Proje ve anahtar sahipliği kontrolü
    const keyResult = await query(
      `SELECT ak.id FROM api_keys ak JOIN games g ON ak.game_id = g.id WHERE ak.id = $1 AND g.id = $2 AND g.developer_id = $3`,
      [keyId, projectId, req.user.userId]
    );
    if (keyResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }
    // Yetkileri güncelle (jsonb için $1::jsonb ve JSON.stringify)
    await query(
      'UPDATE api_keys SET permissions = $1::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(permissions), keyId]
    );
    res.json({ success: true, message: 'API key permissions updated' });
  } catch (error) {
    console.error('Update API key permissions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
