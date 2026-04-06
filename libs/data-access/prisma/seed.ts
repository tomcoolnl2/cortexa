import fs from 'fs';
import yaml from 'js-yaml';
import { User, CreateDeckDto, CreateCardDto } from '@cortexa/types';
import { getPrismaClient } from '../src/lib/prisma-client';

const prisma = getPrismaClient();

async function createDemoDeck(user: User) {
    const demoDeck = await prisma.deck.create({
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

    console.log(`Seeded admin user: ${user.email}`);
    console.log(`Seeded deck: ${demoDeck.title} with 5 cards`);
}

async function createDeckFromYamlFile(user: User) {
    const seedFile = 'libs/data-access/prisma/seed-data.yaml';
    if (fs.existsSync(seedFile)) {
        const fileContents = fs.readFileSync(seedFile, 'utf8');
        const data = yaml.load(fileContents) as { decks: any[] };

        for (const deckData of data.decks) {
            await prisma.deck.create({
                data: {
                    title: deckData.title,
                    description: deckData.description,
                    userId: user.id,
                    cards: {
                        create: deckData.cards.map((c: CreateCardDto) => ({
                            term: c.term,
                            definition: c.definition,
                        })),
                    },
                },
            });
            console.log(`Seeded deck from YAML: ${deckData.title}`);
        }
    } else {
        console.warn(`Seed file not found at path: ${seedFile}. Skipping additional seed data.`);
    }
}

async function createDeckFromTxtFile(user: User) {

    const seedFile = 'libs/data-access/prisma/seed-data.txt';

    if (fs.existsSync(seedFile)) {

        const fileContents = fs.readFileSync(seedFile, 'utf8');
        const cardLines = fileContents.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const anonymousDeck: CreateDeckDto = {
            title: 'Anonymous Deck: ' + new Date().toISOString(),
            description: 'A deck created from a TXT file without explicit deck titles.',
            userId: user.id,
            cards: cardLines.map(line => line.split('|').map(part => part.trim())).map(([term, definition]) => ({ term, definition }))
        };

        await prisma.deck.create({
            data: {
                title: anonymousDeck.title,
                description: anonymousDeck.description,
                userId: user.id,
                cards: {
                    create: anonymousDeck.cards
                }
            },
        });
        console.log(`Seeded deck from TXT: ${anonymousDeck.title}`);

    } else {
        console.warn(`Seed file not found at path: ${seedFile}. Skipping additional seed data.`);
    }
}

async function main() {

    const adminEmail = process.env['ADMIN_EMAIL']?.trim().toLowerCase() ?? 'admin@cortexa.dev';

    // Clean existing data
    await prisma.quizAnswer.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.card.deleteMany();
    await prisma.deck.deleteMany();
    await prisma.user.deleteMany();

    // Create a first admin user (the Google account owner for local bootstrap).
    const user = await prisma.user.create({
        data: {
            email: adminEmail,
            name: 'Admin User',
            role: 'admin',
        },
    });

    // Create a sample demo deck
    await createDemoDeck(user);

    // Load additional deck from a YAML file
    await createDeckFromYamlFile(user);

    // Load additional deck from a TXT file
    await createDeckFromTxtFile(user);
    
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
