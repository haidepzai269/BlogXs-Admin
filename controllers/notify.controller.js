const pool = require('../db');

// Gửi thông báo (từ admin)
exports.sendNotification = async (req, res) => {
  const { content, user_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO notifications (content, user_id) VALUES ($1, $2) RETURNING *',
      [content, user_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi gửi thông báo:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Lấy thông báo theo user_id hoặc chung
exports.getNotifications = async (req, res) => {
  const { user_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id IS NULL OR user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy thông báo:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
