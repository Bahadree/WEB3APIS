const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { SiweMessage } = require('siwe');
const { ethers } = require('ethers');

const { query } = require('../config/database');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/email');
const auth = require('../middleware/auth');

const router = express.Router();

// Register endpoint
console.log('Register endpoint called');
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 }),
  body('fullName').optional().trim(),
  body('dateOfBirth').isISO8601(), // zorunlu hale getirildi
  body('gdprConsent').isBoolean(),
  body('termsConsent').isBoolean(),
  body('privacyConsent').isBoolean()
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
      email,
      username,
      password,
      fullName = null,
      dateOfBirth, // zorunlu
      gdprConsent,
      termsConsent,
      privacyConsent
    } = req.body;

    // Gelen veriyi logla (debug için, prod'da kaldırılabilir)
    console.log('Register body:', req.body);

    if (!dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth is required.'
      });
    }
    // ISO 8601 format kontrolü (YYYY-MM-DD)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(dateOfBirth)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth must be in YYYY-MM-DD format.'
      });
    }

    // Check required consents
    if (!gdprConsent || !termsConsent || !privacyConsent) {
      return res.status(400).json({
        success: false,
        message: 'All consent agreements are required'
      });
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    let user;
    try {
      const result = await query(`
        INSERT INTO users (
          email, username, password_hash, full_name, date_of_birth,
          gdpr_consent, terms_consent, privacy_consent, is_active
        ) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, true)
        RETURNING id, email, username, full_name, created_at
      `, [email, username, passwordHash, fullName, dateOfBirth, gdprConsent, termsConsent, privacyConsent]);
      user = result.rows[0];
    } catch (dbError) {
      if (dbError.code === '23505') { // unique_violation
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }
      if (dbError.code === '23502' && dbError.column === 'date_of_birth') {
        return res.status(400).json({
          success: false,
          message: 'Date of birth is required (DB constraint).'
        });
      }
      console.error('DB error during registration:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error during registration',
        dbError: dbError.detail || dbError.message
      });
    }

    // Create user preferences
    try {
      await query(
        'INSERT INTO user_preferences (user_id) VALUES ($1)',
        [user.id]
      );
    } catch (prefError) {
      console.error('User preferences creation failed:', prefError);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.id);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          createdAt: user.created_at
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Registration error (outer catch):', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', [
  body('identifier').notEmpty().trim(), // email or username
  body('password').notEmpty()
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

    const { identifier, password } = req.body;

    // Find user by email or username
    const result = await query(`
      SELECT id, email, username, password_hash, full_name, is_active, is_verified
      FROM users 
      WHERE (email = $1 OR username = $1)
    `, [identifier]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'User account is not active. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          isVerified: user.is_verified
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Web3 wallet authentication (MetaMask, TrustWallet, WalletConnect)
router.post('/wallet-auth', [
  body('message').notEmpty(),
  body('signature').notEmpty(),
  body('walletAddress').notEmpty(),
  body('walletType').isIn(['metamask', 'trustwallet', 'walletconnect'])
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

    const { message, signature, walletAddress, walletType } = req.body;

    // Verify the signature using SIWE
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.verify({ signature });
      
      if (fields.data.address.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({
          success: false,
          message: 'Wallet address mismatch'
        });
      }

    } catch (siweError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Check if wallet exists
    let walletResult = await query(
      'SELECT id, user_id FROM wallets WHERE wallet_address = $1',
      [walletAddress.toLowerCase()]
    );

    let userId;
    let isNewUser = false;

    if (walletResult.rows.length === 0) {
      // Create new user and wallet
      const userResult = await query(`
        INSERT INTO users (
          email, username, gdpr_consent, terms_consent, privacy_consent, is_verified
        ) VALUES ($1, $2, true, true, true, true)
        RETURNING id
      `, [`${walletAddress.toLowerCase()}@web3.local`, `user_${walletAddress.slice(-8)}`]);

      userId = userResult.rows[0].id;
      isNewUser = true;

      // Create wallet record
      await query(`
        INSERT INTO wallets (user_id, wallet_address, wallet_type, is_primary, is_verified)
        VALUES ($1, $2, $3, true, true)
      `, [userId, walletAddress.toLowerCase(), walletType]);

      // Create user preferences
      await query(
        'INSERT INTO user_preferences (user_id) VALUES ($1)',
        [userId]
      );

    } else {
      userId = walletResult.rows[0].user_id;
    }

    // Update last login
    await query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    res.json({
      success: true,
      message: 'Wallet authentication successful',
      data: {
        user: {
          id: userId,
          walletAddress,
          walletType,
          isNewUser
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Wallet auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get wallet nonce for signing
router.get('/wallet-nonce/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const nonce = Math.floor(Math.random() * 1000000).toString();
    
    // Store nonce temporarily (you might want to use Redis for this)
    await query(`
      INSERT INTO wallets (wallet_address, nonce) 
      VALUES ($1, $2) 
      ON CONFLICT (wallet_address) 
      DO UPDATE SET nonce = $2
    `, [address.toLowerCase(), nonce]);

    const message = `Welcome to Web3APIs! Sign this message to authenticate your wallet.\n\nNonce: ${nonce}`;

    res.json({
      success: true,
      data: {
        message,
        nonce
      }
    });

  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', [
  body('refreshToken').notEmpty()
], async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Logout endpoint
router.post('/logout', auth, async (req, res) => {
  try {
    // In a production app, you'd want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.username, u.full_name, u.avatar_url, 
             u.is_verified, u.created_at, u.last_login_at,
             up.language, up.timezone, up.theme, up.currency_preference
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

    // Get user's wallets
    const walletsResult = await query(
      'SELECT wallet_address, wallet_type, is_primary, is_verified FROM wallets WHERE user_id = $1',
      [user.id]
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          avatarUrl: user.avatar_url,
          isVerified: user.is_verified,
          createdAt: user.created_at,
          lastLoginAt: user.last_login_at,
          preferences: {
            language: user.language,
            timezone: user.timezone,
            theme: user.theme,
            currency: user.currency_preference
          },
          wallets: walletsResult.rows
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.FRONTEND_URL + '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user in DB
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const googleId = profile.id;
    let userResult = await query('SELECT id, email, username FROM users WHERE google_id = $1 OR email = $2', [googleId, email]);
    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const username = profile.displayName || email.split('@')[0];
      const insertResult = await query(
        'INSERT INTO users (email, username, google_id, is_verified, gdpr_consent, terms_consent, privacy_consent) VALUES ($1, $2, $3, true, true, true, true) RETURNING id, email, username',
        [email, username, googleId]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Google OAuth login endpoint
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback endpoint
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: process.env.FRONTEND_URL + '/auth/login',
  session: false
}), async (req, res) => {
  // Generate JWT tokens for the user
  const { accessToken, refreshToken } = generateTokens(req.user.id);
  // Redirect to frontend with tokens (or set cookie, etc.)
  res.redirect(`${process.env.FRONTEND_URL}/auth/login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

module.exports = router;
