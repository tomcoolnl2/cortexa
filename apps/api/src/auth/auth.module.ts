import { Module } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [RolesGuard, JwtAuthGuard],
    exports: [RolesGuard, JwtAuthGuard],
})
export class AuthModule {}
