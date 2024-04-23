

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10); // Hashed password 
  
  await prisma.user.createMany({
    data: [
      {
        username: 'user1',
        password: hashedPassword,
        posts: {
          create: [
            { title: 'Post 1', content: 'Content of Post 1' },
            { title: 'Post 2', content: 'Content of Post 2' },
            { title: 'Post 3', content: 'Content of Post 3' },
          ],
        },
      },
    
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
