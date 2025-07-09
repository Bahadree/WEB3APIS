const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `project_${req.params.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/dev/projects/:id/image
router.post('/:id/image', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    // Save file path to DB
    const imageUrl = `/uploads/${req.file.filename}`;
    const result = await query(
      'UPDATE games SET image_url = $1 WHERE id = $2 AND developer_id = $3 RETURNING *',
      [imageUrl, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      // Remove uploaded file if project not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
