import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { SignJWT } from 'jose';
import { USER_ROLES, UserRole } from '@cortexa/types';

const adminEmail = process.env['ADMIN_EMAIL']?.toLowerCase();
const apiJwtSecret =
    process.env['API_JWT_SECRET'] ?? 'dev-insecure-api-jwt-secret';

const signingKey = new TextEncoder().encode(apiJwtSecret);

function resolveRole(email?: string | null): UserRole {
    if (email && adminEmail && email.toLowerCase() === adminEmail) {
        return 'admin';
    }
    return 'reader';
}

function resolveScenarioRole(input?: string | null): UserRole | undefined {
    if (!input) {
        return undefined;
    }
    return USER_ROLES.find((role) => role === input) as UserRole | undefined;
}

export const { handlers, auth } = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        Google({
            clientId: process.env['GOOGLE_CLIENT_ID'] ?? 'missing-google-client-id',
            clientSecret:
                process.env['GOOGLE_CLIENT_SECRET'] ?? 'missing-google-client-secret',
        }),
    ],
    callbacks: {
        async signIn() {
            return true;
        },
        async jwt({ token, trigger, session }) {
            if (token.email) {
                token.role = resolveRole(token.email);
            }

            if (trigger === 'update' && session?.scenarioRole) {
                token.scenarioRole = resolveScenarioRole(session.scenarioRole);
            }

            return token;
        },
        async session({ session, token }) {
            const role = resolveRole(token.email);
            const scenarioRole = resolveScenarioRole(
                typeof token.scenarioRole === 'string' ? token.scenarioRole : undefined,
            );

            session.user.id = token.sub ?? '';
            session.user.role = role;
            session.scenarioRole = scenarioRole;
            session.apiToken = await new SignJWT({
                role,
                email: token.email,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setSubject(token.sub ?? token.email ?? 'unknown')
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(signingKey);

            return session;
        },
    },
});
