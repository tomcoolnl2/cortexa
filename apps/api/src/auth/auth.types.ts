import { UserRole } from '@cortexa/models';

export interface ApiJwtClaims {
    sub: string;
    email?: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequestUser {
    userId: string;
    email?: string;
    role: UserRole;
    effectiveRole: UserRole;
}
