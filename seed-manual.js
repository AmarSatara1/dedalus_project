require('dotenv').config()

const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to seed...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)
  
  try {
    await prisma.$connect()
    console.log('Connected to database')
    
    const report = await prisma.report.create({
      data: {
        patientName: "John Smith",
        patientAge: 45,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Patient reports intermittent chest tightness after moderate exertion with no symptoms at rest today."
                }
              ]
            }
          ]
        }
      }
    })
    
    console.log('Created report:', report.id)
    
    const report2 = await prisma.report.create({
      data: {
        patientName: "Maria Garcia",
        patientAge: 32,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Patient presents with a persistent dry cough for five days and mild fatigue without shortness of breath."
                }
              ]
            }
          ]
        }
      }
    })
    
    console.log('Created report:', report2.id)
    console.log('Seeding completed successfully!')
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()