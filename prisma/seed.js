require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dentistsData = [
  {
    name: "Dr. Emily Carter",
    specialization: "Orthodontist",
    profilePhotoUrl: "https://example.com/photos/emily.jpg",
  },
  {
    name: "Dr. Michael Nguyen",
    specialization: "Endodontist",
    profilePhotoUrl: "https://example.com/photos/michael.jpg",
  },
  {
    name: "Dr. Sophia Martinez",
    specialization: "Pediatric Dentist",
    profilePhotoUrl: "https://example.com/photos/sophia.jpg",
  },
];

async function main() {
  console.log("Seeding dentists...");
  for (const d of dentistsData) {
    const exists = await prisma.dentist.findFirst({ where: { name: d.name } });
    if (!exists) await prisma.dentist.create({ data: d });
  }
  console.log("✅ Dentists seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
