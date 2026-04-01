import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { getPrismaClient } from '@cortexa/data-access';

/**
 * Thin wrapper around our shared PrismaClient singleton
 * so NestJS can inject it into any service that needs DB access.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
    readonly client = getPrismaClient();

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
