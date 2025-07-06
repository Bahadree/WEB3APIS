const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.username, u.full_name, u.avatar_url, 
             u.date_of_birth, u.is_verified, u.created_at, u.last_login_at,
             up.language, up.timezone, up.theme, up.currency_preference,
             up.email_notifications, up.push_notifications, up.marketing_emails
      FROM users u
      LEFT JOIN user_preferences up ON u.id = up.user_id
      WHERE u.id = $1 AND u.is_active = true
    `, [req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('fullName').optional().trim(),
  body('dateOfBirth').optional().isISO8601(),
  body('avatarUrl').optional().isURL()
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

    const { fullName, dateOfBirth, avatarUrl } = req.body;
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (fullName !== undefined) {
      updateFields.push(`full_name = $${paramCount}`);
      values.push(fullName);
      paramCount++;
    }

    if (dateOfBirth !== undefined) {
      updateFields.push(`date_of_birth = $${paramCount}`);
      values.push(dateOfBirth);
      paramCount++;
    }

    if (avatarUrl !== undefined) {
      updateFields.push(`avatar_url = $${paramCount}`);
      values.push(avatarUrl);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.user.userId);
    
    const result = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND is_active = true
      RETURNING id, email, username, full_name, avatar_url, date_of_birth
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: result.rows[0] }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user preferences
router.put('/preferences', auth, [
  body('language').optional().isLength({ min: 2, max: 10 }),
  body('timezone').optional(),
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('currencyPreference').optional().isLength({ min: 3, max: 10 }),
  body('emailNotifications').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean(),
  body('marketingEmails').optional().isBoolean()
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

    const {
      language,
      timezone,
      theme,
      currencyPreference,
      emailNotifications,
      pushNotifications,
      marketingEmails
    } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (language !== undefined) {
      updateFields.push(`language = $${paramCount}`);
      values.push(language);
      paramCount++;
    }

    if (timezone !== undefined) {
      updateFields.push(`timezone = $${paramCount}`);
      values.push(timezone);
      paramCount++;
    }

    if (theme !== undefined) {
      updateFields.push(`theme = $${paramCount}`);
      values.push(theme);
      paramCount++;
    }

    if (currencyPreference !== undefined) {
      updateFields.push(`currency_preference = $${paramCount}`);
      values.push(currencyPreference);
      paramCount++;
    }

    if (emailNotifications !== undefined) {
      updateFields.push(`email_notifications = $${paramCount}`);
      values.push(emailNotifications);
      paramCount++;
    }

    if (pushNotifications !== undefined) {
      updateFields.push(`push_notifications = $${paramCount}`);
      values.push(pushNotifications);
      paramCount++;
    }

    if (marketingEmails !== undefined) {
      updateFields.push(`marketing_emails = $${paramCount}`);
      values.push(marketingEmails);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.user.userId);

    const result = await query(`
      UPDATE user_preferences 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User preferences not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: result.rows[0] }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's wallets
router.get('/wallets', auth, async (req, res) => {
  try {
    const result = await query(`
      SELECT wallet_address, wallet_type, is_primary, is_verified, created_at
      FROM wallets 
      WHERE user_id = $1
      ORDER BY is_primary DESC, created_at ASC
    `, [req.user.userId]);

    res.json({
      success: true,
      data: { wallets: result.rows }
    });

  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add a new wallet
router.post('/wallets', auth, [
  body('walletAddress').notEmpty().trim(),
  body('walletType').isIn(['metamask', 'trustwallet', 'walletconnect']),
  body('signature').notEmpty(),
  body('message').notEmpty()
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

    const { walletAddress, walletType, signature, message } = req.body;

    // Check if wallet already exists
    const existingWallet = await query(
      'SELECT id FROM wallets WHERE wallet_address = $1',
      [walletAddress.toLowerCase()]
    );

    if (existingWallet.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Wallet already registered'
      });
    }

    // Here you would verify the signature
    // For now, we'll assume it's valid

    // Check if user has any wallets (to set primary)
    const userWallets = await query(
      'SELECT COUNT(*) as count FROM wallets WHERE user_id = $1',
      [req.user.userId]
    );

    const isPrimary = userWallets.rows[0].count === '0';

    const result = await query(`
      INSERT INTO wallets (user_id, wallet_address, wallet_type, is_primary, is_verified)
      VALUES ($1, $2, $3, $4, true)
      RETURNING wallet_address, wallet_type, is_primary, is_verified, created_at
    `, [req.user.userId, walletAddress.toLowerCase(), walletType, isPrimary]);

    res.status(201).json({
      success: true,
      message: 'Wallet added successfully',
      data: { wallet: result.rows[0] }
    });

  } catch (error) {
    console.error('Add wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Set primary wallet
router.put('/wallets/:address/primary', auth, async (req, res) => {
  try {
    const { address } = req.params;

    // First, remove primary status from all user's wallets
    await query(
      'UPDATE wallets SET is_primary = false WHERE user_id = $1',
      [req.user.userId]
    );

    // Set the specified wallet as primary
    const result = await query(`
      UPDATE wallets 
      SET is_primary = true 
      WHERE user_id = $1 AND wallet_address = $2
      RETURNING wallet_address, wallet_type, is_primary
    `, [req.user.userId, address.toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      message: 'Primary wallet updated successfully',
      data: { wallet: result.rows[0] }
    });

  } catch (error) {
    console.error('Set primary wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get user's game sessions count
    const sessionsResult = await query(`
      SELECT COUNT(*) as total_sessions,
             SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_sessions
      FROM game_sessions 
      WHERE user_id = $1
    `, [req.user.userId]);

    // Get user's NFTs count
    const nftsResult = await query(`
      SELECT COUNT(*) as total_nfts,
             COUNT(DISTINCT game_id) as games_with_nfts
      FROM nfts 
      WHERE user_id = $1
    `, [req.user.userId]);

    // Get user's total earnings
    const earningsResult = await query(`
      SELECT SUM(earnings_amount) as total_earnings,
             earnings_token
      FROM game_sessions 
      WHERE user_id = $1 AND earnings_amount > 0
      GROUP BY earnings_token
    `, [req.user.userId]);

    // Get user's game currencies
    const currenciesResult = await query(`
      SELECT gc.*, g.name as game_name
      FROM game_currencies gc
      JOIN games g ON gc.game_id = g.id
      WHERE gc.user_id = $1 AND gc.balance > 0
    `, [req.user.userId]);

    const stats = {
      sessions: sessionsResult.rows[0],
      nfts: nftsResult.rows[0],
      earnings: earningsResult.rows,
      currencies: currenciesResult.rows
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
