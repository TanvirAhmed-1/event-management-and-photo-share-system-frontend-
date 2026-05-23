const { PrismaClient } = require('../wedding_ai_photo_finder_backend/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://c1e3252b2901c72ae788fc647975bbb9b1ca117d71c1a9d3a4c3614bff6af07c:sk__Yj-VMS7eEgb_uToBWtyK@pooled.db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email address. Example: node make-admin.js user@example.com");
    process.exit(1);
  }
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.error(`Error: User with email ${email} not found.`);
    process.exit(1);
  }
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: "SUPER_ADMIN" }
  });
  
  console.log(`Success! User ${email} has been promoted to SUPER_ADMIN!`);
  console.log(updatedUser);
}

main().catch(console.error).finally(() => prisma.$disconnect());
