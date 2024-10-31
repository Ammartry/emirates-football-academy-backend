import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      permissions: ['all'],
      status: 'ACTIVE'
    }
  });

  // Create system settings
  await prisma.systemSettings.create({
    data: {
      monthlyFee: 300,
      uniformFee: 125,
      transportFee: 150,
      vatRate: 5
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });