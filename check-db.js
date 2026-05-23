const { PrismaClient } = require('../wedding_ai_photo_finder_backend/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://c1e3252b2901c72ae788fc647975bbb9b1ca117d71c1a9d3a4c3614bff6af07c:sk__Yj-VMS7eEgb_uToBWtyK@pooled.db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  const photoCount = await prisma.photo.count();
  const embCount = await prisma.faceEmbedding.count();
  console.log(`Photos total: ${photoCount}`);
  console.log(`Face embeddings total: ${embCount}`);
  
  const photos = await prisma.photo.findMany({
    include: {
      _count: {
        select: { faces: true }
      }
    },
    take: 5
  });
  console.log("Recent photos:", JSON.stringify(photos, null, 2));
  
  const events = await prisma.event.findMany({
    include: {
      _count: {
        select: { photos: true }
      }
    }
  });
  console.log("Events:", JSON.stringify(events, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
