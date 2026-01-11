// Seed script for the MicroPost application
// Run with: npm run db:seed

import 'dotenv/config';
import bcrypt from 'bcryptjs';

// Use the shared prisma client
import prisma from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob Wilson',
    },
  });

  console.log('✅ Created users:', { user1, user2, user3 });

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content:
          'Hello everyone! This is my first post on MicroPost. Excited to be here! 🎉',
        userId: user1.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          "Just finished reading an amazing book about software architecture. Highly recommend 'Clean Architecture' by Robert C. Martin! 📚",
        userId: user1.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Working on some TypeScript today. Love how type safety catches bugs before runtime! 💻',
        userId: user2.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Beautiful weather today! Perfect for a walk in the park. ☀️🌳',
        userId: user2.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Just deployed a new feature to production. The CI/CD pipeline made it so smooth! 🚀',
        userId: user3.id,
      },
    }),
    prisma.post.create({
      data: {
        content:
          'Learning about microservices architecture. The complexity is real, but so are the benefits for scaling! 📈',
        userId: user3.id,
      },
    }),
  ]);

  console.log('✅ Created posts:', posts.length);

  console.log('🌱 Seeding complete!');
  console.log('\n📝 Test credentials:');
  console.log('   Email: john@example.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
