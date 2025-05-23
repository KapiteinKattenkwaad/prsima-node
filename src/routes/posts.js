const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 5,
    author,
    published,
    title,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {
    ...(published !== undefined && {
      published: published === 'true'
    }),
    ...(author && {
      author: {
        name: {
          contains: author,
          mode: 'insensitive'
        }
      }
    }),
    ...(title && {
      title: {
        contains: title,
        mode: 'insensitive'
      }
    }),
  };

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take,
        where,
        include: { author: true },
        orderBy: {
          [sort]: order
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      data: posts,
      meta: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
