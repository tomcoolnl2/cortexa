import { cache } from 'react';
import { auth } from '../auth';
import { cookies } from 'next/headers';
import { USER_ROLES, UserRole, ApiAuthContext } from '@cortexa/types';

export interface Viewer {
    authenticated: true;
    name: string | null;
    email: string | null;
    image: string | null;
    /** The real role from the database / session. */
    role: UserRole;
    /** Scenario override set by admin (if any). */
    scenarioRole: UserRole | undefined;
    /** The role currently in effect (scenario ?? real). */
    effectiveRole: UserRole;
    /** Signed JWT for API calls. */
    apiToken: string;
    /** Auth context object ready to pass to the API client. */
    authContext: ApiAuthContext;
    /** Permission helpers */
    canCreate: boolean;
    isAdmin: boolean;
}

export type MaybeViewer = Viewer | null;

/**
 * Resolves the current viewer from the NextAuth session and scenario cookie.
 * Returns `null` for anonymous visitors.
 * Memoized per request via React `cache()` — safe to call from both layout and page.
 */
export const getViewer = cache(async (): Promise<MaybeViewer> => {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const scenarioCookie = (await cookies()).get('cortexa_role_scenario')?.value;
    const scenarioRole = USER_ROLES.find((r) => r === scenarioCookie);
    const effectiveRole = scenarioRole ?? session.user.role;

    return {
        authenticated: true,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        role: session.user.role,
        scenarioRole,
        effectiveRole,
        apiToken: session.apiToken,
        authContext: {
            token: session.apiToken,
            scenarioRole,
        },
        canCreate: effectiveRole === 'admin' || effectiveRole === 'creator',
        isAdmin: effectiveRole === 'admin',
    };
});
