require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

app.use(express.json());
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => res.send('API running 🚀'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
