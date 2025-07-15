import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.users.createMany({
        data: [
            {
                email: 'edwins@gmail.com',
                name: 'Edwin Suryaputra',
                username: 'edwins',
                password: '123456',
                created_by: 'edwin',
                updated_at: new Date(),
                updated_by: 'edwin',
            },
            {
                email: 'budi@gmail.com',
                name: 'Budi Syahputra',
                username: 'budis',
                password: '123456',
                created_by: 'edwin',
                updated_at: new Date(),
                updated_by: 'edwin',
            },
        ],
        skipDuplicates: true,
    })

    console.log('🌱 Seed data inserted!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
