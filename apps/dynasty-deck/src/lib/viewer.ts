import { cache } from 'react';
import { cookies } from 'next/headers';
import { USER_ROLES, MaybeViewer } from '@cortexa/types';
import { auth } from '../auth';


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
        scenarioRole: scenarioRole!,
        effectiveRole,
        apiToken: session.apiToken ?? "",
        authContext: {
            token: session.apiToken ?? "",
            scenarioRole,
        },
        canCreate: effectiveRole === 'admin' || effectiveRole === 'creator',
        isAdmin: effectiveRole === 'admin',
    };
});
