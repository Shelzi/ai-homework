import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496"
      }
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets"
    }
  },
  // Add more users from JSONPlaceholder...
];

async function main() {
  console.log('Start seeding...');

  for (const userData of users) {
    const { address, company, ...userFields } = userData;
    
    // Create user with nested relations
    const user = await prisma.user.create({
      data: {
        ...userFields,
        address: {
          create: {
            ...address,
            geo: {
              create: address.geo
            }
          }
        },
        company: {
          create: company
        },
        auth: {
          create: {
            // Default password for seeded users
            passwordHash: await bcrypt.hash('password123', 10)
          }
        }
      }
    });

    console.log(`Created user with id: ${user.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 