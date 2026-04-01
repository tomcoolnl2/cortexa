import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

/**
 * Returns a singleton PrismaClient instance.
 * In development, stores on globalThis to survive HMR reloads.
 */
export function getPrismaClient(): PrismaClient {
    if (process.env['NODE_ENV'] === 'production') {
        if (!prisma) {
            prisma = new PrismaClient();
        }
        return prisma;
    }

    if (!globalThis.__prisma) {
        globalThis.__prisma = new PrismaClient();
    }

    return globalThis.__prisma;
}

export { PrismaClient };
