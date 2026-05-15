// Simple seed for Prisma 7 - with adapter!
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create adapter
const adapter = new PrismaPg(pool)

// Create PrismaClient with adapter
const prisma = new PrismaClient({ adapter })

function createParagraphContent(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  };
}

const reports = [
  {
    patientName: "John Smith",
    patientAge: 45,
    content: createParagraphContent(
      "Patient reports intermittent chest tightness after moderate exertion with no symptoms at rest today.",
    ),
  },
  {
    patientName: "Maria Garcia",
    patientAge: 32,
    content: createParagraphContent(
      "Patient presents with a persistent dry cough for five days and mild fatigue without shortness of breath.",
    ),
  },
  {
    patientName: "James Wilson",
    patientAge: 67,
    content: createParagraphContent(
      "Patient notes worsening knee pain over the past month that increases with walking and improves with rest.",
    ),
  },
  {
    patientName: "Sarah Johnson",
    patientAge: 28,
    content: createParagraphContent(
      "Patient describes occasional dizziness in the morning associated with skipped meals and low fluid intake.",
    ),
  },
  {
    patientName: "Robert Chen",
    patientAge: 54,
    content: createParagraphContent(
      "Patient reports lower back discomfort after lifting heavy boxes at work but denies numbness or weakness.",
    ),
  },
  {
    patientName: "Emily Davis",
    patientAge: 41,
    content: createParagraphContent(
      "Patient presents with frontal headache and sinus pressure for three days accompanied by nasal congestion.",
    ),
  },
  {
    patientName: "Michael Brown",
    patientAge: 73,
    content: createParagraphContent(
      "Patient reports increased nocturnal urination this week with stable appetite and no fever or chills.",
    ),
  },
];

async function main() {
  console.log("🌱 Seeding database...");
  
  // Clear existing reports
  const deleted = await prisma.report.deleteMany({});
  console.log(`✅ Cleared ${deleted.count} existing reports`);
  
  // Insert new reports
  for (const report of reports) {
    const created = await prisma.report.create({ data: report });
    console.log(`  ✓ Created: ${created.patientName}`);
  }
  
  console.log(`✅ Successfully seeded ${reports.length} reports!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });