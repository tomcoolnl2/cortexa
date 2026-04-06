import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';
import { USER_ROLES } from '@cortexa/types';
import { ApiJwtClaims, AuthenticatedRequestUser } from './auth.types';
import { PrismaService } from '../prisma/prisma.service';

const SECRET = new TextEncoder().encode(
    process.env['API_JWT_SECRET'] ?? 'dev-insecure-api-jwt-secret',
);

const ADMIN_EMAIL = process.env['ADMIN_EMAIL']?.toLowerCase();

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<{
            headers: Record<string, string | string[] | undefined>;
            user?: AuthenticatedRequestUser;
        }>();

        const authHeader = req.headers.authorization;
        const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        if (!raw || !raw.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing bearer token');
        }

        const token = raw.slice(7).trim();

        try {
            const verified = await jwtVerify<ApiJwtClaims>(token, SECRET);
            const email = verified.payload.email?.toLowerCase();

            if (!email) {
                throw new UnauthorizedException('Token email claim is required');
            }

            const isAdmin = ADMIN_EMAIL && email === ADMIN_EMAIL;

            const dbUser = await this.prisma.client.user.upsert({
                where: { email },
                update: {
                    googleSub: verified.payload.sub,
                    ...(isAdmin && { role: 'admin' }),
                },
                create: {
                    email,
                    googleSub: verified.payload.sub,
                    role: isAdmin ? 'admin' : 'reader',
                },
            });

            const role = dbUser.role;

            if (!USER_ROLES.includes(role)) {
                throw new UnauthorizedException('Invalid role claim');
            }

            const scenarioHeader = req.headers['x-cortexa-role-scenario'];
            const scenario = Array.isArray(scenarioHeader)
                ? scenarioHeader[0]
                : scenarioHeader;
            const requestedScenario = USER_ROLES.find((r) => r === scenario);
            const effectiveRole =
                role === 'admin' && requestedScenario ? requestedScenario : role;

            req.user = {
                userId: dbUser.id,
                email,
                role,
                effectiveRole,
            };

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
