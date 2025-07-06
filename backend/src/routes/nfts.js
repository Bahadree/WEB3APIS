const express = require('express');
const { body, validationResult, query: queryValidator } = require('express-validator');
const auth = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Get user's NFTs
router.get('/', auth, [
  queryValidator('game_id').optional().isUUID(),
  queryValidator('category').optional(),
  queryValidator('rarity').optional(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
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

    const { game_id, category, rarity, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE n.user_id = $1';
    const queryParams = [req.user.userId];
    let paramCount = 2;

    if (game_id) {
      whereClause += ` AND n.game_id = $${paramCount}`;
      queryParams.push(game_id);
      paramCount++;
    }

    if (category) {
      whereClause += ` AND n.category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (rarity) {
      whereClause += ` AND n.rarity = $${paramCount}`;
      queryParams.push(rarity);
      paramCount++;
    }

    const result = await query(`
      SELECT n.*, g.name as game_name, g.logo_url as game_logo
      FROM nfts n
      LEFT JOIN games g ON n.game_id = g.id
      ${whereClause}
      ORDER BY n.acquired_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...queryParams, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM nfts n
      ${whereClause}
    `, queryParams);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        nfts: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get NFT by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT n.*, g.name as game_name, g.logo_url as game_logo
      FROM nfts n
      LEFT JOIN games g ON n.game_id = g.id
      WHERE n.id = $1 AND n.user_id = $2
    `, [id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    // Get transaction history for this NFT
    const transactionsResult = await query(`
      SELECT nt.*, 
             fu.username as from_username,
             tu.username as to_username
      FROM nft_transactions nt
      LEFT JOIN users fu ON nt.from_user_id = fu.id
      LEFT JOIN users tu ON nt.to_user_id = tu.id
      WHERE nt.nft_id = $1
      ORDER BY nt.created_at DESC
    `, [id]);

    const nft = {
      ...result.rows[0],
      transactions: transactionsResult.rows
    };

    res.json({
      success: true,
      data: { nft }
    });

  } catch (error) {
    console.error('Get NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// List NFT for sale
router.post('/:id/list', auth, [
  body('price').isFloat({ min: 0 }),
  body('priceToken').optional().isLength({ min: 2, max: 10 })
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
    const { price, priceToken = 'ETH' } = req.body;

    // Check if NFT exists and belongs to user
    const nftResult = await query(
      'SELECT id FROM nfts WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (nftResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    // Update NFT listing status
    const result = await query(`
      UPDATE nfts 
      SET is_listed = true, price = $1, price_token = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `, [price, priceToken, id, req.user.userId]);

    // Record the listing transaction
    await query(`
      INSERT INTO nft_transactions (nft_id, from_user_id, transaction_type, price, price_token)
      VALUES ($1, $2, 'listing', $3, $4)
    `, [id, req.user.userId, price, priceToken]);

    res.json({
      success: true,
      message: 'NFT listed for sale successfully',
      data: { nft: result.rows[0] }
    });

  } catch (error) {
    console.error('List NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Remove NFT listing
router.delete('/:id/list', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE nfts 
      SET is_listed = false, price = NULL, price_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    res.json({
      success: true,
      message: 'NFT listing removed successfully',
      data: { nft: result.rows[0] }
    });

  } catch (error) {
    console.error('Remove NFT listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get marketplace NFTs (public endpoint)
router.get('/marketplace/browse', [
  queryValidator('game_id').optional().isUUID(),
  queryValidator('category').optional(),
  queryValidator('rarity').optional(),
  queryValidator('min_price').optional().isFloat({ min: 0 }),
  queryValidator('max_price').optional().isFloat({ min: 0 }),
  queryValidator('price_token').optional(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
  queryValidator('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'oldest'])
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
      game_id,
      category,
      rarity,
      min_price,
      max_price,
      price_token,
      page = 1,
      limit = 20,
      sort = 'newest'
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE n.is_listed = true';
    const queryParams = [];
    let paramCount = 1;

    if (game_id) {
      whereClause += ` AND n.game_id = $${paramCount}`;
      queryParams.push(game_id);
      paramCount++;
    }

    if (category) {
      whereClause += ` AND n.category = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (rarity) {
      whereClause += ` AND n.rarity = $${paramCount}`;
      queryParams.push(rarity);
      paramCount++;
    }

    if (min_price) {
      whereClause += ` AND n.price >= $${paramCount}`;
      queryParams.push(min_price);
      paramCount++;
    }

    if (max_price) {
      whereClause += ` AND n.price <= $${paramCount}`;
      queryParams.push(max_price);
      paramCount++;
    }

    if (price_token) {
      whereClause += ` AND n.price_token = $${paramCount}`;
      queryParams.push(price_token);
      paramCount++;
    }

    let orderClause = 'ORDER BY n.updated_at DESC';
    switch (sort) {
      case 'price_asc':
        orderClause = 'ORDER BY n.price ASC';
        break;
      case 'price_desc':
        orderClause = 'ORDER BY n.price DESC';
        break;
      case 'oldest':
        orderClause = 'ORDER BY n.updated_at ASC';
        break;
    }

    const result = await query(`
      SELECT n.*, g.name as game_name, g.logo_url as game_logo,
             u.username as owner_username
      FROM nfts n
      LEFT JOIN games g ON n.game_id = g.id
      LEFT JOIN users u ON n.user_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...queryParams, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM nfts n
      ${whereClause}
    `, queryParams);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        nfts: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Browse marketplace error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Purchase NFT from marketplace
router.post('/marketplace/purchase/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get NFT details
    const nftResult = await query(`
      SELECT * FROM nfts 
      WHERE id = $1 AND is_listed = true AND user_id != $2
    `, [id, req.user.userId]);

    if (nftResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFT not available for purchase'
      });
    }

    const nft = nftResult.rows[0];

    // In a real implementation, you would:
    // 1. Verify the user has sufficient funds
    // 2. Process the payment/transfer
    // 3. Transfer the NFT ownership

    // For now, we'll simulate the purchase
    const oldOwnerId = nft.user_id;

    // Transfer ownership
    await query(`
      UPDATE nfts 
      SET user_id = $1, is_listed = false, price = NULL, price_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [req.user.userId, id]);

    // Record the transaction
    await query(`
      INSERT INTO nft_transactions (
        nft_id, from_user_id, to_user_id, transaction_type, 
        price, price_token, marketplace_fee
      ) VALUES ($1, $2, $3, 'sale', $4, $5, 0.025)
    `, [id, oldOwnerId, req.user.userId, nft.price, nft.price_token]);

    res.json({
      success: true,
      message: 'NFT purchased successfully',
      data: {
        nftId: id,
        price: nft.price,
        priceToken: nft.price_token
      }
    });

  } catch (error) {
    console.error('Purchase NFT error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get NFT categories and rarities for filters
router.get('/marketplace/filters', async (req, res) => {
  try {
    const categoriesResult = await query(`
      SELECT DISTINCT category 
      FROM nfts 
      WHERE category IS NOT NULL AND is_listed = true
      ORDER BY category
    `);

    const raritiesResult = await query(`
      SELECT DISTINCT rarity 
      FROM nfts 
      WHERE rarity IS NOT NULL AND is_listed = true
      ORDER BY 
        CASE 
          WHEN rarity = 'common' THEN 1
          WHEN rarity = 'uncommon' THEN 2
          WHEN rarity = 'rare' THEN 3
          WHEN rarity = 'epic' THEN 4
          WHEN rarity = 'legendary' THEN 5
          ELSE 6
        END
    `);

    const tokensResult = await query(`
      SELECT DISTINCT price_token 
      FROM nfts 
      WHERE price_token IS NOT NULL AND is_listed = true
      ORDER BY price_token
    `);

    res.json({
      success: true,
      data: {
        categories: categoriesResult.rows.map(row => row.category),
        rarities: raritiesResult.rows.map(row => row.rarity),
        priceTokens: tokensResult.rows.map(row => row.price_token)
      }
    });

  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
