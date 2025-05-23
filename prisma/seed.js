const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing old data...');

  // 🔥 Delete Posts first due to FK constraint
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding users and posts...');

  const users = [
    {
      email: 'alice@example.com',
      name: 'Alice',
      posts: Array.from({ length: 25 }, (_, i) => ({
        title: `Alice Post #${i + 1}`,
        content: `This is Alice's post #${i + 1}`,
        published: i % 2 === 0,
      })),
    },
    {
      email: 'bob@example.com',
      name: 'Bob',
      posts: Array.from({ length: 20 }, (_, i) => ({
        title: `Bob Post #${i + 1}`,
        content: `This is Bob's post #${i + 1}`,
        published: true,
      })),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        posts: {
          create: user.posts,
        },
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
