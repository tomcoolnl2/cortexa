import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL =
    process.env['DATABASE_URL'] ??
    'postgresql://cortexa:cortexa_dev@localhost:5432/cortexa';

let prisma: PrismaClient;

declare global {
    var __prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL });
    return new PrismaClient({ adapter });
}

/**
 * Returns a singleton PrismaClient instance.
 * In development, stores on globalThis to survive HMR reloads.
 */
export function getPrismaClient(): PrismaClient {
    if (process.env['NODE_ENV'] === 'production') {
        if (!prisma) {
            prisma = createClient();
        }
        return prisma;
    }

    if (!globalThis.__prisma) {
        globalThis.__prisma = createClient();
    }

    return globalThis.__prisma;
}
