import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'rayyan.officialx@gmail.com';
  const password = 'Rayyan@Admin';
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'admin',
      password: hashedPassword,
    },
    create: {
      firstName: 'Rayyan',
      lastName: '(Admin)',
      email: email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user created or updated:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
