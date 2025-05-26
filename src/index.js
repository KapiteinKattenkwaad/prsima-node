require('dotenv').config();
const express = require('express');
const app = express();

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const prisma = require('./db');
const authRoutes = require('./routes/auth');


app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
console.log('authRoutes →', authRoutes, 'type:', typeof authRoutes);

app.use('/auth', authRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

const PORT = process.env.PORT || 4000;

// ✅ Test database connection before starting server
async function startServer() {
  try {
    await prisma.$connect(); // Check DB connection
    console.log('✅ Connected to the database');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Could not connect to the database:', error.message);
    process.exit(1); // Exit process if DB connection fails
  }
}

startServer();
