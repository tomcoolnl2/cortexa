import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.quizAnswer.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.card.deleteMany();
    await prisma.deck.deleteMany();
    await prisma.user.deleteMany();

    // Create a demo user
    const user = await prisma.user.create({
        data: {
            email: 'demo@cortexa.dev',
            name: 'Demo User',
        },
    });

    // Create a sample deck
    const deck = await prisma.deck.create({
        data: {
            title: 'JavaScript Fundamentals',
            description: 'Core concepts of JavaScript',
            userId: user.id,
            cards: {
                create: [
                    {
                        term: 'Closure',
                        definition:
                            'A function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.',
                    },
                    {
                        term: 'Hoisting',
                        definition:
                            "JavaScript's behavior of moving declarations to the top of the current scope before code execution.",
                    },
                    {
                        term: 'Event Loop',
                        definition:
                            'The mechanism that handles asynchronous callbacks in JavaScript by monitoring the call stack and callback queue.',
                    },
                    {
                        term: 'Promise',
                        definition:
                            'An object representing the eventual completion or failure of an asynchronous operation.',
                    },
                    {
                        term: 'Prototype',
                        definition:
                            "An object from which other objects inherit properties and methods in JavaScript's prototype-based inheritance.",
                    },
                ],
            },
        },
    });

    console.log(`Seeded user: ${user.email}`);
    console.log(`Seeded deck: ${deck.title} with 5 cards`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
