// server.js
require('dotenv').config();
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

// Tạo HTTP server và gắn Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Cho phép tất cả frontend kết nối (có thể giới hạn sau)
    methods: ['GET', 'POST']
  }
});

// Lưu đối tượng io để dùng trong controller
app.set('io', io);

// Lắng nghe kết nối Socket.IO
io.on('connection', (socket) => {
  console.log('👥 Một client vừa kết nối:', socket.id);

  socket.on('disconnect', () => {
    console.log('👤 Client ngắt kết nối:', socket.id);
  });
});

// Bắt đầu server
server.listen(PORT, () => {
  console.log(`✅ BE-admin Server đang chạy tại http://localhost:${PORT}`);
});
