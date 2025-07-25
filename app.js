// app.js
const express = require('express');
const path = require('path');
const app = express();
const adminRoutes = require('./routes/admin.routes');
require('dotenv').config();
const notifyRoutes = require('./routes/notify.routes');





// phục vụ file tĩnh trong thư mục "public"
app.use(express.static(path.join(__dirname, 'FE-admin')));

// route mặc định khi vào "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'FE-admin', 'auth.html'));
});



app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api', notifyRoutes);
module.exports = app;
