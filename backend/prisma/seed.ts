import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      googleId: "test123",
      email: "test@example.com",
      name: "Test User",
      picture: "https://example.com/avatar.png",
    },
  });
  console.log("✅ Created user:", user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

