import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  if (!isDevelopment) {
    console.log('⚠️  Seeding is only allowed in development environment');
    console.log('   Set NODE_ENV=development to enable seeding');
    return;
  }

  console.log('🌱 Starting database seed with Faker...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.example.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users (20 fake users)
  console.log('👤 Seeding users...');
  const userCount = 20;
  const users = Array.from({ length: userCount }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  console.log(`✅ Created ${userCount} users`);

  // Seed Examples (50 fake examples)
  console.log('📝 Seeding examples...');
  const exampleCount = 50;
  const examples = Array.from({ length: exampleCount }, () => ({
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.datatype.boolean(0.8) ? faker.lorem.paragraph({ min: 2, max: 5 }) : null,
  }));

  await prisma.example.createMany({
    data: examples,
  });

  console.log(`✅ Created ${exampleCount} examples`);

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${userCount}`);
  console.log(`   - Examples: ${exampleCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
