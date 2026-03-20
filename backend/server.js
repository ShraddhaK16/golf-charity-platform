const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ONLY ONE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Error ❌", err);
  });

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/charity', require('./routes/charity'));
app.use('/api/draws', require('./routes/draws'));

app.get("/test", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const mongoose = require("mongoose");
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected ✅");
//   })
//   .catch((err) => {
//     console.log("MongoDB Error ❌", err);
//   });

// // MongoDB connect
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/golf-charity')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/scores', require('./routes/scores'));
// app.use('/api/subscriptions', require('./routes/subscriptions'));
// app.use('/api/charity', require('./routes/charity'));
// app.use('/api/draws', require('./routes/draws'));

// app.get("/test", (req, res) => {
//   res.send("Backend is working 🚀");
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected ✅");
//   })
//   .catch((err) => {
//     console.log("MongoDB Error ❌", err);
//   });
