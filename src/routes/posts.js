const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.post('/', async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({ data: { title, content, authorId } });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
});

router.put('/:id/publish', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { published: true },
    });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
