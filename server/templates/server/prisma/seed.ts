import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const task1 = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      label: 'task1',
      done: true
    }
  })

  const task2 = await prisma.task.upsert({
    where: { id: 2 },
    update: {},
    create: {
      label: 'task2',
      done: false
    }
  })

  console.log({ task1, task2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
