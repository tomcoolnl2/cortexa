import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: path.join(__dirname, 'libs/data-access/prisma/schema.prisma'),
    datasource: {
        url: process.env['DATABASE_URL'] ?? 'postgresql://cortexa:cortexa_dev@localhost:5432/cortexa',
    },
});
