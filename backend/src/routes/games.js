const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../config/database');

// Placeholder routes - implement as needed
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Games endpoint' });
});

router.get('/wallets', (req, res) => {
  res.json({ success: true, message: 'Wallets endpoint' });
});

// Kullanıcının kayıtlı olduğu oyunlar (game_sessions tablosu ile)
router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      `SELECT DISTINCT g.id, g.name, g.description, g.image_url
       FROM games g
       JOIN game_sessions gs ON gs.game_id = g.id
       WHERE gs.user_id = $1`,
      [userId]
    );
    res.json({ games: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ games: [], error: 'Failed to load games.' });
  }
});

// Sistemdeki tüm oyunlar
router.get('/all', async (req, res) => {
  try {
    const result = await query('SELECT id, name, description, image_url FROM games WHERE is_active = true', []);
    res.json({ games: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ games: [], error: 'Failed to load games.' });
  }
});

module.exports = router;
