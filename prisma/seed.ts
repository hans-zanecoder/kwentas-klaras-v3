import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const services = ['General', 'Social', 'Economic', 'Environmental']

  for (const serviceName of services) {
    await prisma.service.upsert({
      where: { name: serviceName },
      update: {},
      create: {
        name: serviceName,
      },
    })
  }

  console.log('Services seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
