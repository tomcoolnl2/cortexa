import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@cortexa/types';
import { ROLES_KEY } from './roles.decorator';
import { AuthenticatedRequestUser } from './auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const req = context.switchToHttp().getRequest<{ user?: AuthenticatedRequestUser }>();
        const currentRole = req.user?.effectiveRole;

        if (!currentRole || !requiredRoles.includes(currentRole)) {
            throw new ForbiddenException('Insufficient role for this operation');
        }

        return true;
    }
}
