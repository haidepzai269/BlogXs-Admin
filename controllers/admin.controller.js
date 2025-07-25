// controllers/admin.controller.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Đăng ký admin
exports.registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO admin (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
      [username, email, hash]
    );

    const user = result.rows[0];
    const accessToken = createToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
    const refreshToken = createToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi đăng ký hoặc email đã tồn tại' });
  }
};

// Đăng nhập admin
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM admin WHERE username = $1`, [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu sai' });
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const accessToken = createToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
    const refreshToken = createToken(payload, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đăng nhập thất bại' });
  }
};

// Làm mới access token
exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Không có refresh token' });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });

    const payload = { id: user.id, username: user.username, email: user.email };
    const accessToken = createToken(payload, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
    res.json({ accessToken });
  });
};

// ======================
// 📌 Thêm 2 hàm quản lý bài viết cho admin
// ======================
const db = require('../db');

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy bài viết' });
  }
};

// Xoá bài viết theo ID
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xoá bài viết' });
  }
};

exports.sendNotification = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Nội dung không được bỏ trống' });

  try {
    await pool.query('INSERT INTO notifications (content) VALUES ($1)', [content]);
    res.json({ message: 'Đã gửi thông báo hệ thống' });
  } catch (err) {
    console.error('Lỗi gửi thông báo:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
